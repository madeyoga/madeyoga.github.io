<template>
  <div class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10">
    <nav class="relative flex gap-1.5 [&>div]:min-w-0 items-center justify-between bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5">
      <div style="position: relative;">
        <ul class="isolate min-w-0 flex items-center">
          <li class="py-2 min-w-0">
            <a href="/" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">
              <span class="truncate">Home</span>
            </a>
          </li>
          <li class="py-2 min-w-0">
            <a href="/#workexperience" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">
              <span class="truncate">Work Experience</span>
            </a>
          </li>
          <li class="py-2 min-w-0">
            <a href="/#projects" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">Projects</a>
          </li>
          <li class="py-2 min-w-0">
            <a href="/#contact" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">Contact</a>
          </li>
          <li class="py-2 min-w-0">
            <a href="/blog" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">Blog</a>
          </li>
        </ul>

      </div>

      <div>
        <ColorModeButton></ColorModeButton>
      </div>
    </nav>
  </div>
</template>
