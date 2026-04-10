<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <p>{{ __("You're logged in!") }}</p>
                    @php
                        // Retrieve the first role name assigned to the authenticated user
                        $role = auth()->user()->getRoleNames()->first();
                    @endphp
                    @if($role)
                        <p class="mt-4">
                            {{ __("You're logged in as") }}
                            <strong class="text-green-600">{{ ucfirst($role) }}</strong>!
                        </p>
                    @else
                        <p class="mt-4 text-red-600">
                            {{ __("You're logged in but no role has been assigned.") }}
                        </p>
                    @endif
                    <div class="mt-6">
   
    {{-- Admin: Full Access --}}
   <div class="mt-6">
    <h3 class="text-lg font-bold mb-4">Post Actions</h3>

    @can('create posts')
        <button class="px-4 py-2 bg-green-600 text-white rounded mr-2">Create Post</button>
    @endcan

    @can('edit posts')
        <button class="px-4 py-2 bg-blue-600 text-white rounded mr-2">Edit Post</button>
    @endcan

    @can('delete posts')
        <button class="px-4 py-2 bg-red-600 text-white rounded mr-2">Delete Post</button>
    @endcan

    @can('view posts')
        <button class="px-4 py-2 bg-gray-600 text-white rounded">View Posts</button>
    @endcan
</div>

<div class="mt-6">
    <h3 class="text-lg font-bold mb-4">User Actions</h3>

    @can('create users')
        <button class="px-4 py-2 bg-green-600 text-white rounded mr-2">Create User</button>
    @endcan

    @can('edit users')
        <button class="px-4 py-2 bg-blue-600 text-white rounded mr-2">Edit User</button>
    @endcan

    @can('delete users')
        <button class="px-4 py-2 bg-red-600 text-white rounded mr-2">Delete User</button>
    @endcan

    @can('view users')
        <button class="px-4 py-2 bg-gray-600 text-white rounded">View User</button>
    @endcan
</div>

<div class="mt-6">
    <h3 class="text-lg font-bold mb-4">Product Actions</h3>

    @can('create products')
        <button class="px-4 py-2 bg-green-600 text-white rounded mr-2">Create Product</button>
    @endcan

    @can('edit products')
        <button class="px-4 py-2 bg-blue-600 text-white rounded mr-2">Edit Product</button>
    @endcan

    @can('delete products')
        <button class="px-4 py-2 bg-red-600 text-white rounded mr-2">Delete Product</button>
    @endcan

    @can('view products')
        <button class="px-4 py-2 bg-gray-600 text-white rounded">View Product</button>
    @endcan
</div>

</div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>