<script>
    import { onMount } from 'svelte';
    import { Users, Lock, UserPlus, Sparkles } from 'lucide-svelte';
    import { getUsers, registerUser } from '../services/api.js';

    let users = [];
    let username = '';
    let password = '';

    // Fetch all users
    onMount(async () => {
        users = await getUsers();
    });

    // Handle user registration
    async function handleRegisterUser() {
        if (username && password) {
            const result = await registerUser(username, password);
            alert(`User registered with ID: ${result.userId}`);
            users = await getUsers(); // Re-fetch the users list
            username = ''; // Clear input fields
            password = '';
        } else {
            alert("Please enter both username and password.");
        }
    }
</script>

<main class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-6">
    <div class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-105">
        <!-- Title -->
        <div class="flex items-center mb-6 space-x-3">
            <Sparkles class="text-purple-500" size={32} />
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                User Realm
            </h1>
        </div>

        <!-- Registered Users List -->
        <div class="mb-6">
            <div class="flex items-center mb-4 space-x-2">
                <Users class="text-blue-500" />
                <h2 class="text-xl font-semibold text-gray-700">Registered Users</h2>
            </div>
            <ul class="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                {#each users as user}
                    <li 
                        key={user.id} 
                        class="bg-white shadow-sm rounded-md p-2 text-gray-600 hover:bg-blue-50 transition-colors"
                    >
                        {user.username}
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Registration Form -->
        <div>
            <div class="flex items-center mb-4 space-x-2">
                <UserPlus class="text-green-500" />
                <h2 class="text-xl font-semibold text-gray-700">Register New User</h2>
            </div>
            <div class="space-y-4">
                <div class="relative">
                    <input
                        type="text"
                        bind:value={username}
                        placeholder="Username"
                        class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <div class="relative">
                    <input
                        type="password"
                        bind:value={password}
                        placeholder="Password"
                        class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button
                    on:click={handleRegisterUser}
                    class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                >
                    <UserPlus />
                    <span>Register</span>
                </button>
            </div>
        </div>
    </div>
</main>

<style>
    main {
        font-family: Arial, sans-serif;
    }

    .bg-gradient-to-r {
        background-image: linear-gradient(to right, #8b5cf6, #3b82f6);
    }

    .bg-gradient-to-br {
        background-image: linear-gradient(to bottom right, #f3e8ff, #c7d2fe);
    }

    input:focus {
        border-color: #6366f1;
    }
</style>
