<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SFMS | Login</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body class="login-bg">
    <div id="login-root"></div>
    <script src="{{ asset('js/app.js') }}" defer></script>
</body>
</html>
