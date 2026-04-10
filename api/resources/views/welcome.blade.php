<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        /* Animated gradient background */
        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 8s ease infinite;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x p-6">

    <div class="max-w-2xl w-full bg-white shadow-xl rounded-xl p-8">

        <!-- Friendly message -->
       <div class="bg-blue-100 text-blue-800 font-bold px-6 py-4 rounded-lg mb-6 text-center animate-pulse relative overflow-hidden">
    <!-- Bouncing emoji -->
    <span class="absolute left-4 top-1 animate-bounce text-2xl"></span>
    <!-- Interactive message -->
    <span class="inline-block animate-pulse">
        Your API configuration is done! Enjoy fetching your data 
    </span>
    <!-- Typing effect -->
    <span class="typing text-blue-700 font-semibold ml-2"></span>
</div>

        <!-- Users list -->
        <ul class="space-y-3">
            @php
                $users = DB::table('setting')->select('name')->get();
            @endphp

            @foreach ($users as $user)
                <li class="bg-gray-100 rounded-lg px-4 py-2 font-medium hover:bg-blue-100 transition duration-300 text-center">
                    {{ $user->name }}
                </li>
            @endforeach
        </ul>

    </div>

</body>
<style>
/* Typing effect */
.typing::after {
    content: '|';
    animation: blink 1s step-start infinite;
}

@keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
}
</style>
</html>
