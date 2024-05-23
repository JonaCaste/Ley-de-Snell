var width = 0;
var height = 0;

var rayLength = 0.25;

var animatedAngle = 45;
var animationSpeed = 0.5;
var arrayID = 4;

var n1 = 1.00027653;
var n2 = 1.3317;

const listIdsBtnElementos = [
  "btn-elemento-aire",
  "btn-elemento-cubo",
  "btn-elemento-triangulo"
];

const listIdsBtnAnimacion = [
  "pause",
  "play",
  "stop"
];

let triangulo = null;
let rectangulo = null;
/**
 * Por si necesitamos trabajar un diseno no responsive
 */
let referencia = {
  x: 0,
  y: 0
};
let puntoLineaSegundoMedio = null;

var viewport = null;

let flagTriangulo = false;
let flagCuadrado = false;


$(document).ready(function () {
  width = $(document).width();
  height = $(document).height();

  // triangulo = {
  //   vertice1: { x: ((width / 2)+200), y: ((height / 2)) }, // Vértice inferior izquierdo
  //   vertice2: { x: ((width / 2)-200), y: ((height / 2)) }, // Vértice inferior derecho
  //   vertice3: { x: ((width / 2)), y: ((height / 2)+200) }, // Vértice superior
  // };
  // rectangulo = {
  //   x: ((width / 2) - 200), // Vértice inferior izquierdo
  //   y: (height / 2), // Vértice inferior derecho
  //   width: 400, // Vértice superior
  //   height: 200, // Vértice superior
  // };

  let referencia = {
    x: (width / 2),
    y: (height / 2)
  };

  triangulo = {
    vertice1: { x: (referencia.x + 100), y: (referencia.y + 0) }, // Vértice inferior izquierdo
    vertice2: { x: (referencia.x - 100), y: (referencia.y + 0) }, // Vértice inferior derecho
    vertice3: { x: (referencia.x + 0), y: (referencia.y + 100) }, // Vértice superior
  };
  rectangulo = {
    x: (referencia.x - 100),
    y: (referencia.y + 0),
    width: 200,
    height: 100
  };
  puntoLineaSegundoMedio = { x: 0, y: 0 };


  /**
   * Sobreescribimos el width y el height responsive
   */
  // width = 1000;
  // height = 1000;


  //menu config
  // $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Air (under STP)');
  // $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Water');
  // $('#n1text').val(1.00027653);
  // $('#n2text').val(1.3317);

  $(document).on('click', '.dropdown-menu li', function (event) {
    var $target = $(event.currentTarget);
    var num = 0;
    var indizes = [1, 1.00027653, 1.3317, 1.3604, 1.4707, 1.4887, 1.514, 1.5875, 2.409, 3.8771];
    if ($target.attr('data-value').substring(0, 1) == 's') {
      num = parseInt($target.attr('data-value').substring(1, $target.attr('data-value').length)) - 1;
      if (num != 10) {
        n2 = indizes[num];
        // $('#n2text').val(n2.toString());
        document.getElementById("label-medio").innerText = event.currentTarget.innerText
        updateAngle(animatedAngle);
        activarBoton("label-medio");
      } else {
        $('#n2text').val(''); //not quite good, since it implies old value is already overwritten..
      }
    } else {
      num = parseInt($target.attr('data-value')) - 1;
      if (num != 10) {
        n1 = indizes[num];
        $('#n1text').val(n1.toString());
        updateAngle(animatedAngle);
      } else {
        $('#n1text').val('');
      }
    }
    $target.closest('.bs-dropdown-to-select-group')
      .find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
      .end()
      .children('.dropdown-toggle').dropdown('toggle');
    $target.closest('.bs-dropdown-to-select-group')
      .find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
    return false;
  });

  // $("#n1text").on("input", function (e) {
  //   if ($(this).data("lastval") != $(this).val()) {
  //     $(this).data("lastval", $(this).val());
  //     //change action
  //     if ($("#n1text").val() == '1') { //I don't really care about the other materials..
  //       $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
  //     } else {
  //       $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Other');
  //     }
  //     if (isNaN(parseFloat($("#n1text").val()))) {
  //       $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
  //       n1 = 1;
  //     } else {
  //       n1 = parseFloat($("#n1text").val());
  //     }
  //     updateAngle(animatedAngle);
  //   };
  // });

  // $("#n2text").on("input", function (e) {
  //   if ($(this).data("lastval") != $(this).val()) {
  //     $(this).data("lastval", $(this).val());
  //     //change action
  //     if ($("#n2text").val() == '1') { //I don't really care about the other materials..
  //       $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
  //     } else {
  //       $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Other');
  //     }
  //     if (isNaN(parseFloat($("#n2text").val()))) {
  //       $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
  //       n2 = 1;
  //     } else {
  //       n2 = parseFloat($("#n2text").val());
  //     }
  //     updateAngle(animatedAngle);
  //   };
  // });

  // $('#setAngle').on('keydown', function (event) {
  //   if (event.keyCode == 13) {
  //     event.preventDefault();
  //     updateAngle(parseFloat($('#setAngle').val()))
  //   }
  // });

  $('#play').on('click', function (event) {
    interval = d3.interval(animation, 1);
    desactivarBotones(listIdsBtnAnimacion);
    activarBoton("play");
  });

  $('#pause').on('click', function (event) {
    interval.stop();
    desactivarBotones(listIdsBtnAnimacion);
    activarBoton("pause");
  });

  $('#stop').on('click', function (event) {
    interval.stop();
    animatedAngle = 0;
    updateAngle(animatedAngle);
    desactivarBotones(listIdsBtnAnimacion);
    activarBoton("stop");
  });

  // $('#slower').on('click', function (event) {
  //   animationSpeedControl(-1);
  // });

  // $('#faster').on('click', function (event) {
  //   animationSpeedControl(1);
  // });

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform);
    }))
    .append("g");

  viewport = svg.append('g');

  var x = d3.scaleLinear().range([width / 2 - 5000 * width / height, width / 2 + 5000 * width / height]).domain([-50, 50]); //not very elegant...
  var y = d3.scaleLinear().range([height / 2 - 5000 * width / height, height / 2 + 5000 * width / height]).domain([50, -50]);

  // Add the x Axis
  svg.append("g")
    .attr("transform", "translate(" + 0 + "," + height / 2 + ")")
    .call(d3.axisBottom(x).ticks(100));

  // Add the y Axis
  svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + 0 + ")")
    .call(d3.axisLeft(y).ticks(100));

  var rayIn = viewport.append('line')
    .attr('x1', width / 2)
    .attr('y1', height / 2)
    .attr('x2', width * rayLength + width / 2)
    .attr('y2', height / 2)
    .attr("stroke-width", 2)
    .attr("stroke", "red")
    .attr('id', 'rayIn');

  var rayReflected = viewport.append('line')
    .attr('x1', width / 2)
    .attr('y1', height / 2)
    .attr('x2', width / 2)
    .attr('y2', height / 2)
    .attr("stroke-width", 2)
    .attr("stroke", "red")
    .attr('id', 'rayReflected');

  var rayRefracted = viewport.append('line')
    .attr('x1', width / 2)
    .attr('y1', height / 2)
    .attr('x2', width / 2)
    .attr('y2', height / 2)
    .attr("stroke-width", 2)
    .attr("stroke", "red")
    .attr('id', 'rayRefracted');

  var laser = viewport.append("rect").attr("x", width * rayLength + width / 2)
    .attr("y", height / 2 - 10)
    .attr("width", 100)
    .attr("height", 20)
    .style('fill', 'black')
    .attr('id', 'laser');

  viewport.append('text').attr('x', width * rayLength + width / 2 + 30)
    .attr('y', height / 2 + 5)
    // .text('LASER')
    .style('fill', 'blue')
    .attr('id', 'laserText');

  var dragPoint = viewport.append('circle')
    .attr('cx', height / 2.5 + width / 2)
    .attr('cy', height / 2)
    .attr('r', 5)
    .attr('id', 'dragPoint')
    .style('fill', 'blue')
    .datum({
      x: height / 2.5 + width / 2,
      y: height / 2
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));
  // theta 1
  var angleIndicatorOuter = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(0)
    .endAngle(0);

  viewport.append('path')
    .attr('d', angleIndicatorOuter)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .attr('id', 'anglePath')
    .style('fill', 'green');

  var angleIndicatorInner = d3.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(0)
    .endAngle(0);

  viewport.append('path')
    .attr('d', angleIndicatorInner)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .attr('id', 'anglePath2')
    .style('fill', 'green')
    .style('opacity', 0.25);

  // theta 1'
  var angleIndicatorOuter = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(0)
    .endAngle(0);

  viewport.append('path')
    .attr('d', angleIndicatorOuter)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .attr('id', 'anglePathS')
    .style('fill', 'orange');

  var angleIndicatorInner = d3.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(0)
    .endAngle(0);

  viewport.append('path')
    .attr('d', angleIndicatorInner)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .attr('id', 'anglePath2S')
    .style('fill', 'orange')
    .style('opacity', 0.25);

  // theta 2
  var angleIndicatorOuter = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(0)
    .endAngle(0);

  viewport.append('path')
    .attr('d', angleIndicatorOuter)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .attr('id', 'anglePathS2')
    .style('fill', 'blue');

  var angleIndicatorInner = d3.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(0)
    .endAngle(0);

  viewport.append('path')
    .attr('d', angleIndicatorInner)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .attr('id', 'anglePath2S2')
    .style('fill', 'blue')
    .style('opacity', 0.25);

  updateAngle(45);


  document.getElementById("btn-elemento-cubo").addEventListener("click", e => {
    limpiarElementos();
    viewport.append('rect')
      .attr('width', rectangulo.width)
      .attr('height', rectangulo.height)
      .attr('x', rectangulo.x)
      .attr('y', rectangulo.y)
      .attr('fill', 'blue')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'blue')
      .attr('stroke-width', 5)
      .attr('id', 'elementoCubo');

    desactivarBotones(listIdsBtnElementos);
    activarBoton("btn-elemento-cubo");
    flagCuadrado = true;
  });

  document.getElementById("btn-elemento-triangulo").addEventListener("click", e => {
    limpiarElementos();
    viewport.append('path')
      .attr('d', 'M ' + triangulo.vertice1.x + ',' + triangulo.vertice1.y + ' L ' +
        triangulo.vertice2.x + ',' + triangulo.vertice2.y + ' L ' +
        triangulo.vertice3.x + ',' + triangulo.vertice3.y + ' Z')
      .attr('fill', 'blue')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'blue')
      .attr('stroke-width', 5)
      .attr('id', 'elementoTriangulo');

    desactivarBotones(listIdsBtnElementos);
    activarBoton("btn-elemento-triangulo");
    flagTriangulo = true;
  });

  document.getElementById("btn-elemento-aire").addEventListener("click", e => {
    limpiarElementos();
    desactivarBotones(listIdsBtnElementos);
    activarBoton("btn-elemento-aire");
  });

  function limpiarElementos() {
    viewport.select('#elementoCubo').remove();
    viewport.select('#elementoTriangulo').remove();
    viewport.select('#lineaMedio2').remove();
    flagTriangulo = false;
    flagCuadrado = false;
  }

  function activarBoton(idBtn) {
    let btn = document.getElementById(idBtn);
    btn.classList.remove("btn-outline-secondary");
    btn.classList.add("btn-outline-primary");
  }

  function desactivarBotones(listaBotones) {
    listaBotones.forEach(btnId => {
      let btn = document.getElementById(btnId);
      btn.classList.remove("btn-outline-primary");
      btn.classList.remove("btn-outline-secondary"); //Lo eliminamos para evitar tener esta clase repetida en los btn desactivados
      btn.classList.add("btn-outline-secondary");
    })
  }

});

/**
   * Funciones para el calculo del 2 medio con el elemento triangulo
   */

function pintarLaserMedioDosTriangulo(anguloRefraccion) {
  viewport.select('#lineaMedio2 ').remove();

  anguloRefraccion = 90 - anguloRefraccion; // Ya que nuestro angulo es con respecto a y

  anguloRefraccion = anguloRefraccion * (Math.PI / 180); // Pasamos a rad

  const alpha = 1.5708 - anguloRefraccion;

  const pendienteLinea = Math.tan(alpha);
  const pendienteHipotenusa = -1;
  const bHipotenusa = ((height/2) - (triangulo.vertice3.y));

  // x + y - bHipotenusa = 0
  // pendienteLinea * x + y = 0
  const x = -bHipotenusa / (pendienteLinea + 1);
  //Reemplazamos en cualquier ecu
  const y = pendienteLinea * x;

  //Se anade para pintarlo correctamente dentro de nuestro diseno responsive
  const coordXFinal = ((triangulo.vertice2.x + x) );
  const coordYFinal = ((triangulo.vertice2.y - y) - ((height/2)-triangulo.vertice3.y));

  angleMedio2 = leySnellMedio2(alpha);
  coordsFinalLaserMedio2 = crearCoordenadasDesdeAnguloConEje45Deg(coordXFinal, coordYFinal, anguloRefraccion, angleMedio2)


  viewport.append('path')
    .attr('d', 'M ' + coordXFinal + ',' + coordYFinal + ' L '
      + (coordsFinalLaserMedio2.x) + ',' + (coordsFinalLaserMedio2.y))
    .attr('stroke', 'green')
    .attr('stroke-width', 5)
    .attr('id', 'lineaMedio2');;

}

/**
   * Funciones para el calculo del 2 medio con el elemento cuadrado
   */

function pintarLaserMedioDosCuadrado(anguloRefraccion) {
  viewport.select('#lineaMedio2').remove();

  const alpha = anguloRefraccion * (Math.PI / 180);

  anguloRefraccion = 90 - anguloRefraccion; // Ya que nuestro angulo es con respecto a y

  anguloRefraccion = anguloRefraccion * (Math.PI / 180); // Pasamos a rad

  let xInterseccion = 0;
  let yInterseccion = 0;
  let angleMedio2 = 0;
  let coordsFinalLaserMedio2 = 0;

  if (0 <= anguloRefraccion && anguloRefraccion <= 0.785398) {

    const hipotenusa = (rectangulo.width / 2) / Math.cos(anguloRefraccion)
    const co = Math.sqrt((hipotenusa * hipotenusa) - ((rectangulo.width / 2) * (rectangulo.width / 2)))
    xInterseccion = (rectangulo.x)
    yInterseccion = (rectangulo.y + co)

    angleMedio2 = leySnellMedio2(anguloRefraccion);
    coordsFinalLaserMedio2 = crearCoordenadasDesdeAnguloConEjeX(xInterseccion, yInterseccion, angleMedio2)

  }
  if (0.785398 < anguloRefraccion && anguloRefraccion <= 1.5708) {
    const hipotenusa = (rectangulo.height) / Math.cos(alpha)
    const co = Math.sqrt((hipotenusa * hipotenusa) - ((rectangulo.height) * (rectangulo.height)))
    xInterseccion = (rectangulo.x + rectangulo.width / 2) - co
    yInterseccion = (rectangulo.y + rectangulo.height)

    angleMedio2 = leySnellMedio2(alpha);
    coordsFinalLaserMedio2 = crearCoordenadasDesdeAnguloConEjeY(xInterseccion, yInterseccion, angleMedio2)
  }

  viewport.append('path')
    .attr('d', 'M ' + xInterseccion + ',' + yInterseccion + ' L '
      + coordsFinalLaserMedio2.x + ',' + coordsFinalLaserMedio2.y)
    .attr('stroke', 'green')
    .attr('stroke-width', 5)
    .attr('id', 'lineaMedio2');;
}

function dragstarted(d) {
  d3.select(this).classed("active", true);
}

function dragged(d) {
  d.x += d3.event.dx;
  d.y += d3.event.dy;

  var x1 = width / 2 - d.x;
  var y1 = height / 2 - d.y;

  if (y1 < 0) {
    var phi = 2 * Math.PI + 2 * Math.acos((x1) / (Math.sqrt(x1 * x1 + y1 * y1) * (1)));
  } else {
    var phi = 2 * Math.acos((x1) / (Math.sqrt(x1 * x1 + y1 * y1) * (-1)));
  }

  updateAngle(round(phi * 180 / (2 * Math.PI), 2));
}

function dragended(d) {
  d3.select(this).classed("active", false);
}

function round(number, precision) {
  var pair = (number + 'e').split('e')
  var value = Math.round(pair[0] + 'e' + (+pair[1] + precision))
  pair = (value + 'e').split('e')
  return +(pair[0] + 'e' + (+pair[1] - precision))
}

function updateAngle(deg) {
  animatedAngle = deg;
  var totalReflectionAngle = Math.asin(n2 / n1);
  var phi = deg * 2 * Math.PI / 180;

  if (deg > 90 && deg < 270) {
    updateAngle(90);
  } else if (deg >= 270) {
    updateAngle(0);
  } else if (Math.abs((Math.PI - phi) * 180 / (2 * Math.PI)) > totalReflectionAngle * 180 / Math.PI) {
    $('#theta_1').html("&#x03B8;&#x2081; &#x2248; " + round(Math.abs((Math.PI - phi) * 180 / (2 * Math.PI)), 2) + "°");

    var angleIndicatorOuter = d3.arc()
      .innerRadius(50)
      .outerRadius(52)
      .startAngle(0)
      .endAngle(-phi / 2 + Math.PI / 2);

    d3.select('#anglePath').attr('d', angleIndicatorOuter);

    var angleIndicatorInner = d3.arc()
      .innerRadius(0)
      .outerRadius(50)
      .startAngle(0)
      .endAngle(-phi / 2 + Math.PI / 2);

    d3.select('#anglePath2').attr('d', angleIndicatorInner);

    $('#theta_1_2').html("&#x03B8;&#x2081;' &#x2248; " + round(Math.abs((Math.PI - phi) * 180 / (2 * Math.PI)), 2) + "°");

    var angleIndicatorOuter2 = d3.arc()
      .innerRadius(50)
      .outerRadius(52)
      .startAngle(0)
      .endAngle(phi / 2 - Math.PI / 2);

    d3.select('#anglePathS').attr('d', angleIndicatorOuter2);

    var angleIndicatorInner2 = d3.arc()
      .innerRadius(0)
      .outerRadius(50)
      .startAngle(0)
      .endAngle(phi / 2 - Math.PI / 2);

    d3.select('#anglePath2S').attr('d', angleIndicatorInner2);

    //change ray path
    d3.select('#rayIn').attr('x2', width / 2 + Math.cos(phi / 2) * width * rayLength)
      .attr('y2', height / 2 - Math.sin(phi / 2) * width * rayLength);

    d3.select('#rayReflected').attr('x2', width / 2 + Math.sin(phi / 2 - Math.PI / 2) * 10 * width)
      .attr('y2', height / 2 - Math.cos(phi / 2 - Math.PI / 2) * 10 * width);

    d3.select('#laser').attr('transform', `rotate(${-deg} ${width / 2} ${height / 2})`);



    if (deg > 90) {
      d3.select('#laserText').attr('transform', `rotate(${-deg} ${width / 2} ${height / 2}) rotate(${180} ${d3.select('#laserText').node().getBBox().x + 25}  ${d3.select('#laserText').node().getBBox().y + 8})`);
    } else {
      d3.select('#laserText').attr('transform', `rotate(${-deg} ${width / 2} ${height / 2})`);
    }

    d3.select('#dragPoint').attr('cx', width / 2 + Math.cos(phi / 2) * height / 2.5)
      .attr('cy', height / 2 - Math.sin(phi / 2) * height / 2.5)
      .datum({
        x: width / 2 + Math.cos(phi / 2) * height / 2.5,
        y: height / 2 - Math.sin(phi / 2) * height / 2.5
      }).raise();


    //get rid of refracted ray since we have total reflection
    d3.select('#anglePath2S2').style('opacity', 0);
    d3.select('#anglePathS2').style('opacity', 0);
    d3.select('#rayRefracted').style('opacity', 0);
    //apply this to the sign too
    $('#theta_2').html('');
  }
  else {
    d3.select('#anglePath2S2').style('opacity', 0.25);
    d3.select('#rayRefracted').style('opacity', 1);
    d3.select('#anglePathS2').style('opacity', 1);

    $('#theta_1').html("&#x03B8;&#x2081; &#x2248; " + round(Math.abs((Math.PI - phi) * 180 / (2 * Math.PI)), 2) + "°");

    var angleIndicatorOuter = d3.arc()
      .innerRadius(50)
      .outerRadius(52)
      .startAngle(0)
      .endAngle(-phi / 2 + Math.PI / 2);

    d3.select('#anglePath').attr('d', angleIndicatorOuter);

    var angleIndicatorInner = d3.arc()
      .innerRadius(0)
      .outerRadius(50)
      .startAngle(0)
      .endAngle(-phi / 2 + Math.PI / 2);

    d3.select('#anglePath2').attr('d', angleIndicatorInner);

    $('#theta_1_2').html("&#x03B8;&#x2081;' &#x2248; " + round(Math.abs((Math.PI - phi) * 180 / (2 * Math.PI)), 2) + "°");

    var angleIndicatorOuter2 = d3.arc()
      .innerRadius(50)
      .outerRadius(52)
      .startAngle(0)
      .endAngle(phi / 2 - Math.PI / 2);

    d3.select('#anglePathS').attr('d', angleIndicatorOuter2);

    var angleIndicatorInner2 = d3.arc()
      .innerRadius(0)
      .outerRadius(50)
      .startAngle(0)
      .endAngle(phi / 2 - Math.PI / 2);

    d3.select('#anglePath2S').attr('d', angleIndicatorInner2);

    var phi2 = (Math.asin(n1 / n2 * Math.sin(phi / 2 - Math.PI / 2)) + Math.PI) * (-1);

    var angleIndicatorOuter3 = d3.arc()
      .innerRadius(50)
      .outerRadius(52)
      .startAngle(-Math.PI)
      .endAngle(phi2);

    d3.select('#anglePathS2').attr('d', angleIndicatorOuter3);

    var angleIndicatorInner3 = d3.arc()
      .innerRadius(0)
      .outerRadius(50)
      .startAngle(-Math.PI)
      .endAngle(phi2);

    d3.select('#anglePath2S2').attr('d', angleIndicatorInner3);

    let theta2 = round(Math.abs(phi2 * (-1) * 180 / (Math.PI) - 180), 2)

    $('#theta_2').html("&#x03B8;&#x2082; &#x2248; " + theta2 + "°")

    //change ray path
    d3.select('#rayIn').attr('x2', width / 2 + Math.cos(phi / 2) * width * rayLength)
      .attr('y2', height / 2 - Math.sin(phi / 2) * width * rayLength);

    d3.select('#rayReflected').attr('x2', width / 2 + Math.sin(phi / 2 - Math.PI / 2) * 10 * width)
      .attr('y2', height / 2 - Math.cos(phi / 2 - Math.PI / 2) * 10 * width);

    d3.select('#rayRefracted').attr('x2', width / 2 + Math.sin(phi2) * 10 * width)
      .attr('y2', height / 2 - Math.cos(phi2) * 10 * width);

    d3.select('#laser').attr('transform', `rotate(${-deg} ${width / 2} ${height / 2})`);


    /**
     * Logica para medio 2
     */
    if (flagTriangulo) pintarLaserMedioDosTriangulo(theta2)
    if (flagCuadrado) pintarLaserMedioDosCuadrado(theta2)


    if (deg > 90) {
      d3.select('#laserText').attr('transform', `rotate(${-deg} ${width / 2} ${height / 2}) rotate(${180} ${d3.select('#laserText').node().getBBox().x + 25}  ${d3.select('#laserText').node().getBBox().y + 8})`);
    } else {
      d3.select('#laserText').attr('transform', `rotate(${-deg} ${width / 2} ${height / 2})`);
    }

    d3.select('#dragPoint').attr('cx', width / 2 + Math.cos(phi / 2) * height / 2.5)
      .attr('cy', height / 2 - Math.sin(phi / 2) * height / 2.5)
      .datum({
        x: width / 2 + Math.cos(phi / 2) * height / 2.5,
        y: height / 2 - Math.sin(phi / 2) * height / 2.5
      }).raise();


  }
}

function animation() {
  animatedAngle += animationSpeed;
  if (animatedAngle > 90 || animatedAngle < 0) {
    animationSpeed = -animationSpeed;
  }
  updateAngle(animatedAngle);
}

function animationSpeedControl(direction) {
  var speeds = [0.01, 0.05, 0.1, 0.5, 1, 5, 10];
  if (arrayID + direction > -1 && arrayID + direction < 7) {
    arrayID = arrayID + direction;
    console.log(speeds[arrayID]);
    if (animationSpeed > 0) {
      animationSpeed = speeds[arrayID];
    } else {
      animationSpeed = speeds[arrayID] * (-1);
    }
  } else {
    console.log("Maximum (or minimum) speed is exceeded.");
  }
}

function leySnellMedio2(angle) {
  return Math.asin((n2 * Math.sin(angle)) / n1);
}

function crearCoordenadasDesdeAnguloConEjeX(coordX, coordY, angle) {

  const coordXReferencia = coordX - 200;
  const coordYReferencia = coordY;

  const hipotenusa = 200 / Math.cos(angle)
  const co = Math.sqrt((hipotenusa * hipotenusa) - (200 * 200));

  return {
    x: coordXReferencia,
    y: (coordYReferencia + co)
  }

}

function crearCoordenadasDesdeAnguloConEjeY(coordX, coordY, angle) {

  const coordXReferencia = coordX;
  const coordYReferencia = coordY + 200;

  const hipotenusa = 200 / Math.cos(angle)
  const co = Math.sqrt((hipotenusa * hipotenusa) - (200 * 200));

  return {
    x: (coordXReferencia - co),
    y: coordYReferencia
  }

}

function crearCoordenadasDesdeAnguloConEje45Deg(coordX, coordY, thetaRef, alpha) {

  let betha = thetaRef - (1.5708   - alpha); // Angulo de snell(alpha) = thetaRef 
                                               //Como el angulo de refraccion depende de nuestra hipotenusaPuntoReferencia, debemos restar esa diferencia
  const omega = 1.5708 - thetaRef - betha;

  const coordXReferencia = coordX - 200;
  const coordYReferencia = coordY;

  const hipotenusaPuntoReferencia = coordXReferencia / Math.cos(thetaRef); // Recta saliente del elemento

  const hipotenusa = hipotenusaPuntoReferencia / Math.cos(betha);

  const caLaserMedio2 = hipotenusa * Math.cos(omega) //ca del laser saliente con el angulo de snell con referencia al eje y
  const coLaserMedio2 = hipotenusa * Math.sin(omega) //co del laser saliente con el angulo de snell con referencia del eje y

  return {
    x: (coordX - coLaserMedio2),
    y: (coordY + caLaserMedio2)
  }

}


