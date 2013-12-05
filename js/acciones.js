// JavaScript Document
  var IP="";
$(document).ready(function(e){
	document.addEventListener("deviceready",function(){
		
		
		$('.Enviar').tap (function(){
			var formulario=$(this).parents('form');
			switch(formulario.attr('name'))
			{
					case 'enviarf':
					IP=document.getElementById('conectar').value;
					buscaralumnos(document.getElementById('Grupo').value);
					break;
			}
		}); //tap
		
		
		
		alert("Listo");
	var db = openDatabase("Test","1.0","BASE DE PRUEBA",65535);
		$("#Crear").bind("click", function(event){
			alert("Crear");
			db.transaction(function(ejecutar){
    var sql = "CREATE TABLE Alumnos (No_Control INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Nombre VARCHAR(30) NOT NULL, ApellidoP VARCHAR(40) NOT NULL, ApellidoM VARCHAR(40) NOT NULL)";
				ejecutar.executeSql(sql,undefined, function(){
					alert("Tabla Alumnos Creada");
				}, error);
				
	var sql = "CREATE TABLE Asistencias (No_Control INTEGER NOT NULL, Asistencia VARCHAR(30) NOT NULL, Asignatura VARCHAR(10) NOT NULL, Fecha VARCHAR(40) NOT NULL )";
				ejecutar.executeSql(sql,undefined, function(){
					alert("Tabla Asistencias Creada");
				}, error);			
				
	var sql = "CREATE TABLE Asignaturas (Asignatura VARCHAR(10) NOT NULL, NombreA VARCHAR(40) NOT NULL )";
				ejecutar.executeSql(sql,undefined, function(){
					alert("Tabla Asignatura Creada");
				}, error);			
			
	var sql = "CREATE TABLE Grupos (Grupo VARCHAR(10) NOT NULL, Activo Text NOT NULL )";
				ejecutar.executeSql(sql,undefined, function(){
					alert("Tabla Asignatura Creada");
				}, error);				
				
				
			});//Ejecutar
		});//Crear
		
		$("#Eliminar").bind("click",function(event){
			alert("Eliminar");
			if(!confirm("Borrar tabla?",""))
			return;
			db.transaction(function(ejecutar){
				var sql="DROP TABLE Clientes";
				ejecutar.executeSql (sql, undefined,function (){
					alert("Tabla Borrada");
				},error);
			});//ejecutar
		});//eliminar
		
		$("#Insertar").bind ("click", function (event){
  var v_nombre = $("#Nombre").val ();
  var v_apellido = $("#Apellido").val ();
  
  db.transaction (function (ejecutar) 
  {
    var sql = "INSERT INTO Clientes (Nombre, Apellido) VALUES (?, ?)";
    ejecutar.executeSql (sql, [v_nombre, v_apellido], function ()
    { 
      alert ("Cliente Agregado");
    }, error);
  });
});
	
	$("#listar").bind ("click", function (event)
{
  db.transaction (function (ejecutar) 
  {
    var sql = "SELECT * FROM Clientes";

    ejecutar.executeSql (sql, undefined,

    function (ejecutar, resultado)
    {
      var a_html = "<ul>";
      if (resultado.rows.length)
      {alert(resultado.rows.length);
        for (var i = 0; i < resultado.rows.length; i++) 
        {
          var fila = resultado.rows.item (i);
          var v_nombre = fila.Nombre;
          var v_apellido = fila.Apellido;
		  var v_id=fila.id;
		  a_html += "<li data-icon=false id= " + v_id +" >";
		  a_html += "<a href=#>";
          a_html += v_nombre + "&nbsp;" + v_apellido;
		  a_html += "</a>";
		  a_html += "</li>";
        }
      }
      else
      {
        a_html += "<li> No hay clientes </li>";
      }
      
      a_html += "</ul>";
      
      $("#listado").unbind ().bind ("pagebeforeshow", function ()
      {
        var $contenido = $("#listado div:jqmData(role=content)");
        $contenido.html (a_html);
        var $ul = $contenido.find ("ul");
        $ul.listview ();
		
		$("li").bind ("swiperight", function (event)
        {
          var id_borrar = $(this).attr ("id");
          if (!id_borrar) return;
		  
          $(this).remove ();
          
          db.transaction (function (ejecutar) 
          {
            var SQL = "DELETE FROM Clientes WHERE id=?";
            ejecutar.executeSql (SQL, [id_borrar], function ()
            { 
			  navigator.notification.beep(2);
			  alert ("Cliente Borrado");
            }, error);//ejecutar
          });// transaction
        });// swipe right 
		
	  });
      
      $.mobile.changePage ($("#listado"));
      
    }, error);
  });
  });
  
  	function error (transaction, err) 
{
  alert ("Error de Base de Datos : " + err.message);
  return false;
}    	
	},false);//add
  
  

  function buscaralumnos(Gpo)
  {
	  datos="Grupo="+Gpo;
	  $.ajax({
		  		type:"POST",
				url:"http://"+IP+"/lista/agregar.php",
  				data:datos
	  }).done(function(msg){
		  if(msg=="*" || msg==null)
		  {
			  alert("No se encontraron alumnos en ese grupo");
		  }
  		else
  		{
	  		alert(msg);
			var OAlumno=jQuery.parseJSON(msg);
			alert(OAlumno.alumnos[0].Nombre); 
			
  		}
  	});
  }
		
	
});//ready