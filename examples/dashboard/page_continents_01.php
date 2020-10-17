<?php
require_once '../includes/header.php'
?>

<body class="bg-dark text-white">

  <main>

    <br><br>

    <div class="container">
      <p>Graph 1</p>
      <div class="d-flex justify-content-center" id="vis1" style="width: 100%; height: 98vh;"></div>
    </div>

    <br><br>

    <div class="container">
      <p>Graph 2</p>
      <div class="d-flex justify-content-center" id="vis2" style="width: 100%; height: 700px;"></div>
    </div>

    <div class="container">
      <p>Graph 3</p>
      <div class="d-flex justify-content-center" id="vis3" style="width: 100%; height: 700px;"></div>
    </div>

    <div class="container">
      <p>Graph 4</p>
      <div class="d-flex justify-content-center" id="vis4" style="width: 100%; height: 700px;"></div>
    </div>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>

  </main>

  <?php require_once '../includes/footer.php'; ?>

  <script src="../cdn/amcharts_4.10.2/amcharts4/core.js"></script>
  <!-- <script src="../cdn/amcharts_4.10.2/amcharts4/charts.js"></script> -->
  <script src="../cdn/amcharts_4.10.2/amcharts4/maps.js"></script>
  <script src="../cdn/amcharts_4.10.2/amcharts4/themes/animated.js"></script>
  <script src="../cdn/amcharts_4.10.2/amcharts4/themes/moonrisekingdom.js"></script>

 <!--  <script src="../cdn/amcharts_4.10.2/amcharts4/geodata/continentsLow.js"></script> -->
  <script src="../cdn/amcharts_4.10.2/amcharts4/geodata/continentsRussiaEuropeLow.js"></script>

  <script src="../data/API/continentes.js"></script>
  <script src="../scrp/continents_01.js"></script>
  



</body>

</html>