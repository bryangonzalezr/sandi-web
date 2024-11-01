<template>
  <div class="flex h-screen bg-warm-beige">
    <div class="w-1/2 bg-light-green flex flex-col justify-evenly m-2 rounded-lg">
      <div class="text-center text-3xl">
        Bienvenid@ a SandiApp
      </div>
      <div class="h-[80%] p-5 flex justify-center">
        <img 
          src="@/assets/images/Sandi.png" 
          alt="Sandi Chef" 
        />
      </div>
    </div>
    <RouterView />
  </div>
</template>
  