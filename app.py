#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify, render_template
#from flask import request

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------



app = Flask(__name__)
CORS(app)  # Esto habilitará CORS para todas las rutas

#--------------------------------------------------------------------
class Catalogo:
    #----------------------------------------------------------------
    # Constructor de la clase
    def __init__(self, host, user, password, database):
        # Primero, establecemos una conexión sin especificar la base de datos
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()

        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        # Una vez que la base de datos está establecida, creamos la tabla si no existe
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS artistas (
            codigo INT,
            nombre VARCHAR(255) NOT NULL,
            descripcion VARCHAR(255) NOT NULL,  
            precio DECIMAL(10, 2) NOT NULL,                    
            imagen_url VARCHAR(255)
            )''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
        
    #----------------------------------------------------------------
    def agregar_artista(self, codigo, nombre, descripcion, precio, imagen):
        # Verificamos si ya existe un producto con el mismo código
        self.cursor.execute(f"SELECT * FROM artistas WHERE codigo = {codigo}")
        artista_existe = self.cursor.fetchone()
        if artista_existe:
            return False
        else:        
            sql = "INSERT INTO artistas (codigo, nombre, descripcion, precio, imagen_url) VALUES (%s, %s, %s, %s, %s)"
            valores = (codigo, nombre, descripcion, precio, imagen)
            self.cursor.execute(sql, valores)        
            self.conn.commit()
            return True

    #----------------------------------------------------------------
    def consultar_artista(self, codigo):
        # Consultamos un producto a partir de su código
        self.cursor.execute(f"SELECT * FROM artistas WHERE codigo = {codigo}")
        return self.cursor.fetchone()

    #----------------------------------------------------------------
    def modificar_artista(self, codigo, nuevo_nombre, nueva_descripcion, nuevo_precio, nueva_imagen):
        sql = "UPDATE artistas SET nombre= %s, descripcion = %s, precio = %s, imagen_url = %s WHERE codigo = %s"
        valores = (nuevo_nombre, nueva_descripcion, nuevo_precio, nueva_imagen, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    #----------------------------------------------------------------
    def listar_artistas(self):
        self.cursor.execute("SELECT * FROM artistas")
        listaArtistas = self.cursor.fetchall()
        return listaArtistas

    #----------------------------------------------------------------
    def eliminar_artista(self, codigo):
        # Eliminamos un producto de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM artistas WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    #----------------------------------------------------------------
    def mostrar_artista(self, codigo):
        # Mostramos los datos de un producto a partir de su código
        artista = self.consultar_artista(codigo)
        if artista:
            print("-" * 40)
            print(f"Código.....: {artista['codigo']}")
            print(f"Nombre.....: {artista['nombre']}")
            print(f"Descripción: {artista['descripcion']}")            
            print(f"Precio.....: {artista['precio']}")
            print(f"Imagen.....: {artista['imagen_url']}")
            print("-" * 40)
        else:
            print("Artista no encontrado.")


#--------------------------------------------------------------------
# Cuerpo del programa
#--------------------------------------------------------------------
# Crear una instancia de la clase Catalogo
catalogo = Catalogo(host='localhost', user='root', password='root', database='miapp')
#catalogo = Catalogo(host='USUARIO.mysql.pythonanywhere-services.com', user='USUARIO', password='CLAVE', database='USUARIO$miapp')

# catalogo.agregar_producto(1, "Televisor 25",11, 340000, "tele.jpg",1)
# catalogo.agregar_producto(2, "Notebook",11, 740000, "compu.jpg",1)
# catalogo.agregar_producto(3, "Mouse tres botones",11, 3400, "mouse.jpg",1)


# Carpeta para guardar las imagenes.
RUTA_DESTINO = './assets/img/Artistas/'

#Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
#RUTA_DESTINO = '/home/USUARIO/mysite/static/imagenes'


#--------------------------------------------------------------------
# Listar todos los productos
#--------------------------------------------------------------------
#La ruta Flask /productos con el método HTTP GET está diseñada para proporcionar los detalles de todos los productos almacenados en la base de datos.
#El método devuelve una lista con todos los productos en formato JSON.
@app.route("/artistas", methods=["GET"])
def listar_artistas():
    artistas = catalogo.listar_artistas()
    return jsonify(artistas)


#--------------------------------------------------------------------
# Mostrar un sólo producto según su código
#--------------------------------------------------------------------
#La ruta Flask /productos/<int:codigo> con el método HTTP GET está diseñada para proporcionar los detalles de un producto específico basado en su código.
#El método busca en la base de datos el producto con el código especificado y devuelve un JSON con los detalles del producto si lo encuentra, o None si no lo encuentra.
@app.route("/artistas/<int:codigo>", methods=["GET"])
def mostrar_artista(codigo):
    artista = catalogo.consultar_artista(codigo)
    if artista:
        return jsonify(artista), 201
    else:
        return "Artista no encontrado", 404


#--------------------------------------------------------------------
# Agregar un producto
#--------------------------------------------------------------------
@app.route("/artistas", methods=["POST"])
#La ruta Flask `/productos` con el método HTTP POST está diseñada para permitir la adición de un nuevo producto a la base de datos.
#La función agregar_producto se asocia con esta URL y es llamada cuando se hace una solicitud POST a /productos.
def agregar_artista():
    #Recojo los datos del form
    codigo = request.form['codigo']
    nombre = request.form['nombre']
    descripcion = request.form['descripcion']
    precio = request.form['precio']
    imagen = request.files['imagen']
    nombre_imagen=""

    # Me aseguro que el producto exista
    artista = catalogo.consultar_artista(codigo)
    if not artista: # Si no existe el producto...
        # Genero el nombre de la imagen
        nombre_imagen = secure_filename(imagen.filename) #Chequea el nombre del archivo de la imagen, asegurándose de que sea seguro para guardar en el sistema de archivos
        nombre_base, extension = os.path.splitext(nombre_imagen) #Separa el nombre del archivo de su extensión.
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" #Genera un nuevo nombre para la imagen usando un timestamp, para evitar sobreescrituras y conflictos de nombres.
        
        #Se agrega el producto a la base de datos
        if  catalogo.agregar_artista(codigo, nombre, descripcion, precio, nombre_imagen):
            imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))

            #Si el producto se agrega con éxito, se devuelve una respuesta JSON con un mensaje de éxito y un código de estado HTTP 201 (Creado).
            return jsonify({"mensaje": "Artista agregado correctamente.", "imagen": nombre_imagen}), 201
        else:
            #Si el producto no se puede agregar, se devuelve una respuesta JSON con un mensaje de error y un código de estado HTTP 500 (Internal Server Error).
            return jsonify({"mensaje": "Error al agregar el Artista."}), 500

    else:
        #Si el producto ya existe (basado en el código), se devuelve una respuesta JSON con un mensaje de error y un código de estado HTTP 400 (Solicitud Incorrecta).
        return jsonify({"mensaje": "Artista ya existe."}), 400
    

#--------------------------------------------------------------------
# Modificar un producto según su código
#--------------------------------------------------------------------
@app.route("/artistas/<int:codigo>", methods=["PUT"])
#La ruta Flask /productos/<int:codigo> con el método HTTP PUT está diseñada para actualizar la información de un producto existente en la base de datos, identificado por su código.
#La función modificar_producto se asocia con esta URL y es invocada cuando se realiza una solicitud PUT a /productos/ seguido de un número (el código del producto).
def modificar_artista(codigo):
    #Se recuperan los nuevos datos del formulario
    nuevo_nombre = request.form.get("nombre")
    nueva_descripcion = request.form.get("descripcion")
    nuevo_precio = request.form.get("precio")
    imagen = request.files['imagen']

    # Procesamiento de la imagen
    nombre_imagen = secure_filename(imagen.filename) #Chequea el nombre del archivo de la imagen, asegurándose de que sea seguro para guardar en el sistema de archivos
    nombre_base, extension = os.path.splitext(nombre_imagen) #Separa el nombre del archivo de su extensión.
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" #Genera un nuevo nombre para la imagen usando un timestamp, para evitar sobreescrituras y conflictos de nombres.

    # Busco el producto guardado
    artista = artista = catalogo.consultar_artista(codigo)
    if artista: # Si existe el producto...
        imagen_vieja = artista["imagen_url"]
        # Armo la ruta a la imagen
        ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

        # Y si existe la borro.
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)
    
    # Se llama al método modificar_producto pasando el codigo del producto y los nuevos datos.
    if catalogo.modificar_artista(codigo, nuevo_nombre, nueva_descripcion, nuevo_precio, nombre_imagen):
        #La imagen se guarda en el servidor.
        imagen.save(os.path.join(RUTA_DESTINO, nombre_imagen))

        #Si la actualización es exitosa, se devuelve una respuesta JSON con un mensaje de éxito y un código de estado HTTP 200 (OK).
        return jsonify({"mensaje": "Artista modificado"}), 200
    else:
        #Si el producto no se encuentra (por ejemplo, si no hay ningún producto con el código dado), se devuelve un mensaje de error con un código de estado HTTP 404 (No Encontrado).
        return jsonify({"mensaje": "Artista no encontrado"}), 403



#--------------------------------------------------------------------
# Eliminar un producto según su código
#--------------------------------------------------------------------
@app.route("/artistas/<int:codigo>", methods=["DELETE"])
#La ruta Flask /productos/<int:codigo> con el método HTTP DELETE está diseñada para eliminar un producto específico de la base de datos, utilizando su código como identificador.
#La función eliminar_producto se asocia con esta URL y es llamada cuando se realiza una solicitud DELETE a /productos/ seguido de un número (el código del producto).
def eliminar_artista(codigo):
    # Busco el producto en la base de datos
    artista = catalogo.consultar_artista(codigo)
    if artista: # Si el producto existe, verifica si hay una imagen asociada en el servidor.
        imagen_vieja = artista["imagen_url"]
        # Armo la ruta a la imagen
        ruta_imagen = os.path.join(RUTA_DESTINO, imagen_vieja)

        # Y si existe, la elimina del sistema de archivos.
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        # Luego, elimina el producto del catálogo
        if catalogo.eliminar_artista(codigo):
            #Si el producto se elimina correctamente, se devuelve una respuesta JSON con un mensaje de éxito y un código de estado HTTP 200 (OK).
            return jsonify({"mensaje": "Artista eliminado"}), 200
        else:
            #Si ocurre un error durante la eliminación (por ejemplo, si el producto no se puede eliminar de la base de datos por alguna razón), se devuelve un mensaje de error con un código de estado HTTP 500 (Error Interno del Servidor).
            return jsonify({"mensaje": "Error al eliminar el artista"}), 500
    else:
        #Si el producto no se encuentra (por ejemplo, si no existe un producto con el codigo proporcionado), se devuelve un mensaje de error con un código de estado HTTP 404 (No Encontrado). 
        return jsonify({"mensaje": "Artista no encontrado"}), 404

#--------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)