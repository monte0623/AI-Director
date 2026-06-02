<!DOCTYPE html>
<html lang="zh-Hant">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>
AI Director Assistant V10.0B-R1
</title>

<link
rel="manifest"
href="manifest.json">

<link
rel="stylesheet"
href="css/main.css">

</head>

<body>

<!-- ======================
HEADER
====================== -->

<header class="app-header">

<div class="logo">

🎬 AI Director

</div>

<div class="version">

V10.0B-R1

</div>

</header>

<!-- ======================
MAIN APP
====================== -->

<div id="app">

</div>

<!-- ======================
SCRIPTS
====================== -->

<script src="js/state.js"></script>

<script src="js/db.js"></script>

<script src="js/project.js"></script>

<script src="js/workspace.js"></script>

<script src="js/app.js"></script>

<script>

if(
'serviceWorker'
in navigator
){

navigator
.serviceWorker
.register(
'./sw.js'
);

}

</script>

</body>

</html>