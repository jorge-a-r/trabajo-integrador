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

    function validarPrefijo(element){
        const prefijos = [11,220,2202,221,2221,2223,2224,2225,2226,2227,2229,223,2241,2242,2243,2244,2245,2246,2252,2254,2255,2257,
            2261,2262,2264,2265,2266,2267,2268,2271,2272,2273,2274,2281,2283,2284,2285,2286,2291,2292,2296,2297,230,2302,
            2314,2316,2317,2320,2323,2324,2325,2326,2331,2333,2334,2335,2336,2337,2338,2342,2343,2344,2345,2346,2352,2353,
            2354,2355,2356,2357,2358,236,237,2392,2393,2394,2395,2396,2473,2474,2475,2477,2478,249,260,261,2622,2624,2625,
            2626,263,264,2646,2647,2648,2651,2655,2656,2657,2658,266,280,2901,2902,2903,291,2920,2921,2922,2923,2924,2925,
            2926,2927,2928,2929,2931,2932,2933,2934,2935,2936,294,2940,2942,2945,2946,2948,2952,2953,2954,2962,2963,2964,
            2966,297,2972,298,2982,2983,299,3327,3329,336,3382,3385,3387,3388,3400,3401,3402,3404,3405,3406,3407,3408,3409,
            341,342,343,3435,3436,3437,3438,3442,3444,3445,3446,3447,345,3454,3455,3456,3458,3460,3462,3463,3464,3465,3466,
            3467,3468,3469,3471,3472,3476,348,3482,3483,3487,3489,3491,3492,3493,3496,3497,3498,351,3521,3522,3524,3525,
            353,3532,3533,3537,3541,3542,3543,3544,3546,3547,3548,3549,3562,3563,3564,3571,3572,3573,3574,3575,3576,358,
            3582,3583,3584,3585,362,364,370,3711,3715,3716,3718,3721,3725,3731,3734,3735,3741,3743,3751,3754,3755,3756,
            3757,3758,376,3772,3773,3774,3775,3777,3781,3782,3786,379,380,381,3821,3825,3826,3827,383,3832,3835,3837,3838,
            3841,3843,3844,3845,3846,385,3854,3855,3856,3857,3858,3861,3862,3863,3865,3867,3868,3869,387,3873,3876,3877,
            3878,388,3885,3886,3887,3888,3891,3892,3894];
        
        console.log(prefijos.includes(Number(element.val())));

        if(!prefijos.includes(Number(element.val()))){
            element.focus();
            element.next().text("El prefijo no es válido");
            return;
        }else{
            element.next().text("");
            return true;
        }
    }

    function validarTelefono(telefono, prefijo){
        if (telefono.val().length < 6) {
            telefono.focus();
            telefono.next().text("El numero ingresado no es valido");
            return false;
        }else if((telefono.val().length + prefijo.val().length) != 10){
            prefijo.focus();
            telefono.focus();
            telefono.next().text("El numero de telefono debe tener 10 caracteres");
            return false;
        } else{
            telefono.next().text("");
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

    
    $("#name").keyup(function(){
        validarNombre($(this))
    });

    $("#prefijo").keyup(function(){
        validarPrefijo($(this));
    });

    $("#telefono").keyup(function(){
        validarTelefono($(this), $("#prefijo"))
    });

    $("#correo").keyup(function(){
        validarEmail($(this))
    });
    
    //Validación al hacer click en siguiente
    siguiente_paso_1.click(()=>{    
        if (validarNombre($("#name")) && validarPrefijo($("#prefijo")) && validarTelefono($("#telefono"), $("#prefijo")) && validarEmail($("#correo"))) {
            let current = $(".form-section.current");
            let siguiente = current.next();
            //Asignar valores al objeto datosPersona
            datosPersona.nombre = $("#name").val();
            datosPersona.telefono = $("#prefijo").val() + $("#telefono").val();
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
    
    $("#date").keyup(function(){
        validarFecha($(this));
    });
    $("#time").keyup(function(){
        validarHora($(this));
    });
    $("#people").keyup(function(){
        validarPersonas($(this));
    });

    siguiente_paso_2.click(()=>{
        
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