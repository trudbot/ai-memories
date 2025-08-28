<template>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g class="bars">
            <rect x="4" y="9" width="2" height="6" fill="currentColor" class="bar1"/>
            <rect x="8" y="7" width="2" height="10" fill="currentColor" class="bar2"/>
            <rect x="12" y="5" width="2" height="14" fill="currentColor" class="bar3"/>
            <rect x="16" y="7" width="2" height="10" fill="currentColor" class="bar4"/>
            <rect x="20" y="9" width="2" height="6" fill="currentColor" class="bar5"/>
        </g>
    </svg>
</template>

<style scoped>
.bars rect {
    animation: sound 1s ease infinite alternate;
    transform-origin: bottom;
}

.bar1 { animation-delay: 0.1s; }
.bar2 { animation-delay: 0.2s; }
.bar3 { animation-delay: 0.3s; }
.bar4 { animation-delay: 0.4s; }
.bar5 { animation-delay: 0.5s; }

@keyframes sound {
    0% {
        transform: scaleY(0.3);
    }
    100% {
        transform: scaleY(1);
    }
}
</style>
