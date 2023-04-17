$(document).ready(() => {
    window.jsPDF = window.jspdf.jsPDF;
    /*---------------------------------------------------------------------------------*/
    //FORMULARIO DE RESERVA DE MESA
    const form_reserva = $("#form-reserva");
    const siguiente_paso_1 = $("#btn-siguiente-paso1");
    const siguiente_paso_2 = $("#btn-siguiente-paso2");
    const reservar = $("#btn-reservar");
    const confirmar_reserva = $("#confirmar-reserva");
    const descargar_comprobante = $("#descargar-comprobante");
    
    let datosPersona = {
        nombre : '',
        telefono : '',
        email : '',
        fecha : '',
        hora : '',
        personas : '',
        observaciones : ''
    };

    //Funcionamiento del boton Atras
    $(".atras").click(function(){
        let current = $(".form-section.current");
        anterior = current.prev();

        if (anterior != null) {
            anterior.addClass("current");
            current.removeClass("current");
        }
    });

    //Desabilitamos el envío del formulario
    form_reserva.submit(function(e){
        e.preventDefault();

    });

    //VALIDACIÓN POR PASOS DEL ASISTENTE DE RESERVA
    //PASO 1
    //Funciones para validar campos del paso 1
    function validarNombre(element){
        if (element.val().length < 3) {
            element.focus();
            element.next().text("El nombre debe tener 3 caracteres como mínimo");
            return false;
        }else{
            element.next().text("");
            return true;
        }
        
    }

    function validarTelefono(element){
        if (element.val().length < 10) {
            element.focus();
            element.next().text("El telefono debe tener 10 caracteres como minimo");
            return false;
        }else{
            element.next().text("");
            return true;
        }
    }

    function validarEmail(element){
        const re = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$";
        if (element.val() === undefined || element.val() == "" || !element.val().match(re)) {
            element.focus();
            element.next().text("El email no es válido");
            return false;
        }else{
           element.next().text("");
            return true;
        }
    }

    //Validación al hacer click en siguiente
    siguiente_paso_1.click(()=>{
        $("#name").keyup(function(){
            validarNombre($(this))
        });

        $("#telefono").keyup(function(){
            validarTelefono($(this))
        });

        $("#correo").keyup(function(){
            validarEmail($(this))
        });
        if (validarNombre($("#name")) && validarTelefono($("#telefono")) && validarEmail($("#correo"))) {
            let current = $(".form-section.current");
            let siguiente = current.next();
            //Asignar valores al objeto datosPersona
            datosPersona.nombre = $("#name").val();
            datosPersona.telefono = $("#telefono").val();
            datosPersona.email = $("#correo").val(); 
            //Mostrar el siguiente paso
            if (siguiente != null) {
                siguiente.addClass("current");
                current.removeClass("current");
            }
        }
    });

    //PASO 2
    //Funciones para validar campos del paso 2
    //Fecha mínima de reserva
    let fecha_act = new Date();
    let fecha_min = new Date();
    const hora_min = "11:00";
    const hora_max = "22:30";
    fehca_min = fecha_min.setDate(fecha_act.getDate() + 2);
    $("#date").prop("min", fecha_min.toISOString().split("T")[0]);

    function validarFecha(element){
        if (element.val() === undefined || element.val() == "") {
            element.focus();
            element.next().text("Debe ingresar una fecha");
            return false;
        }else if(element.val() < fecha_min){
            element.next().text("La fecha no es válida");
            return false;
        }
        else{
            element.next().text("");
            return true;
        }
    }

    function validarHora(element){
        if (element.val() === undefined || element.val() == "") {
            element.focus();
            element.next().text("Debe ingresar una hora");
            return false;
        }else if(element.val() < hora_min){
            element.next().text("La hora no es válida");
            return false;
        }else if(element.val() > hora_max){
            element.next().text("La hora no es válida");
            return false;
        }
        else{
            element.next().text("");
            return true;
        }
    }

    function validarPersonas(element){
        if (element.val() === undefined || element.val() == "") {
            element.focus();
            element.next().text("Debe ingresar la cantidad de personas");
            return false;
        }else if(element.val() < 1){
            element.next().text("Debe ingresar al menos una persona");
            return false;
        }else if(element.val() > 6){
            element.next().text("Se acepta un máximo de 6 personas");
            return false;
        }else{
            element.next().text("");
            return true;
        }
    }

    siguiente_paso_2.click(()=>{
        $("#date").keyup(function(){
            validarFecha($(this));
        });
        $("#time").keyup(function(){
            validarHora($(this));
        });
        $("#people").keyup(function(){
            validarPersonas($(this));
        });
        if (validarFecha($("#date")) && validarHora($("#time")) && validarPersonas($("#people"))) {
            let current = $(".form-section.current");
            let siguiente = current.next();
            //Asignar valores al objeto datosPersona
            datosPersona.fecha = $("#date").val();
            datosPersona.hora = $("#time").val();
            datosPersona.personas = $("#people").val(); 
            //Mostrar el siguiente paso
            if (siguiente != null) {
                siguiente.addClass("current");
                current.removeClass("current");
            }
        }
        
    });

    //Pasar al modal de confirmación de reserva
    reservar.click(()=>{
        datosPersona.observaciones = $("#observaciones").val();
        //Almacenamos la fecha y hora actual
        let fecha_hora_act = new Date().toLocaleString();

        //Mostrar datos en el modal de confirmación
        $("#confirmar-nombre").text(datosPersona.nombre);
        $("#confirmar-telefono").text(datosPersona.telefono);
        $("#confirmar-email").text(datosPersona.email);
        $("#confirmar-fecha").text(datosPersona.fecha);
        $("#confirmar-hora").text(datosPersona.hora);
        $("#confirmar-personas").text(datosPersona.personas);
        $("#confirmar-observaciones").text(datosPersona.observaciones);
        $("#fecha-hora").text(fecha_hora_act);
    });

    //Acciones a realizar al confirmar la reserva
    confirmar_reserva.click(()=>{
        console.log(datosPersona);
    });

    //Descargar comprobante de reserva
    descargar_comprobante.click(()=>{
        //let contenido_modal_confirmar = $("#contenido-modal-confirmar").html();
        let doc = new jsPDF('p', 'pt', 'a7');
        let fecha_hora_act = new Date().toLocaleString();
        
        doc.setFontSize(14);
        doc.text("Comprobante de reserva", 25, 25);
        doc.setFontSize(8);
        doc.text(`Nombre: ${datosPersona.nombre} | Teléfono: ${datosPersona.telefono}`, 10, 60);
        doc.text(`e-mail: ${datosPersona.email}`, 10, 80);
        doc.text(`Fecha: ${datosPersona.fecha} | Hora: ${datosPersona.hora} | Personas: ${datosPersona.personas}`, 10, 100);
        doc.text(`Observaciones: ${datosPersona.observaciones}`, 10, 120);
        doc.text(`Fecha y hora de emisión: ${fecha_hora_act}`, 10, 140);

        doc.save('comprobante-reserva.pdf');
    });

    /*---------------------------------------------------------------------------------*/
    //API DE COMIDAS
    //Formato de objeto retornado
    /*
        {
            id
            nombre
            descripcion
            linkImagen
            precio
        }
    */
    
    //Contenedor de los items del menu
    const divPizzas = $("#pizzas");

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://pizzaallapala.p.rapidapi.com/productos",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "dad441a087msh170471ec82a1ee0p17588cjsnb001960dfb12",
            "X-RapidAPI-Host": "pizzaallapala.p.rapidapi.com"
        }
    };

    //Llamado a ajax. Generamos los items para cada objeto retornado
    $.ajax(settings).done(function (response) {
        for (let i = 0; i < response.productos.length-9; i++) {
            generarItem(response.productos[i]);
        }
    });

    //Función para generar html de los items del menú
    function generarItem(obj){
        divPizzas.append(
            "<div class='col-md-4 menu-item'>"+
                `<a href='${obj.linkImagen}' class='glightbox'>`+
                    `<img src='${obj.linkImagen}' class='menu-img img-fluid' alt=''>`+
                "</a>"+
                `<h4>${obj.nombre}</h4>`+
                `<p class='ingredients'>${obj.descripcion}</p>`+
                `<p class='price'>$${obj.precio}</p>`+
            "</div>"
        );
    }

    /*---------------------------------------------------------------------------------*/
    //VALIDACIÓN FORMULARIO DE CONTACTO
    $("#contacto").validate({
        rules: {
            nombre:{
                required: true,
                minlength: 3,
                maxlength: 30,
            },
            email:{
                required: true,
                email: true
            },
            asunto:{
                required: true,
                minlength: 5
            },
            mensaje:{
                required: true,
                minlength: 5,
                maxlength: 500,
            }
        }
    }) 
    //Mensajes predeterminados traducidos para el complemento de validación de jQuery
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        remote: "Por favor, rellena este campo.",
        email: "Por favor, escribe una dirección de correo válida",
        url: "Por favor, escribe una URL válida.",
        date: "Por favor, escribe una fecha válida.",
        dateISO: "Por favor, escribe una fecha (ISO) válida.",
        number: "Por favor, escribe un número entero válido.",
        digits: "Por favor, escribe sólo dígitos.",
        creditcard: "Por favor, escribe un número de tarjeta válido.",
        equalTo: "Por favor, escribe el mismo valor de nuevo.",
        accept: "Por favor, escribe un valor con una extensión aceptada.",
        maxlength: jQuery.validator.format("Por favor, no escribas más de {0} caracteres."),
        minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres."),
        rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
        range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
        max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
        min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
    });

    //Prevenir envío de formulario. Mostrar mensaje de éxito
    $("#contacto").submit((e)=>{
        e.preventDefault();
    });
});