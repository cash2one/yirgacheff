
<style>
.loaders {
    width: 100%;
    box-sizing: border-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex: 0 1 auto;
        -ms-flex: 0 1 auto;
            flex: 0 1 auto;
    -webkit-flex-direction: row;
        -ms-flex-direction: row;
            flex-direction: row;
    -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap;
}
.loaders .loader {
    box-sizing: border-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex: 0 1 auto;
        -ms-flex: 0 1 auto;
            flex: 0 1 auto;
    -webkit-flex-direction: column;
        -ms-flex-direction: column;
            flex-direction: column;
    -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
            flex-grow: 1;
    -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
            flex-shrink: 0;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-justify-content: center;
        -ms-flex-pack: center;
            justify-content: center;
}
@-webkit-keyframes ball-scale-multiple {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        opacity: 0; }

    5% {
        opacity: 1; }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 0; } }

@keyframes ball-scale-multiple {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        opacity: 0; }

    5% {
        opacity: 1; }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 0; } }

.ball-scale-multiple {
    position: relative;
    -webkit-transform: translateY(-30px);
    -ms-transform: translateY(-30px);
    transform: translateY(-30px); }
.ball-scale-multiple > div:nth-child(2) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s; }
.ball-scale-multiple > div:nth-child(3) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s; }
.ball-scale-multiple > div {
    background-color: #2aabe6;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    position: absolute;
    left: 0px;
    top: 0px;
    opacity: 0;
    margin: 0;
    width: 60px;
    height: 60px;
    -webkit-animation: ball-scale-multiple 1s 0s linear infinite;
    animation: ball-scale-multiple 1s 0s linear infinite; }

.animated {
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
}

</style>

<template>
<div class='loaders'>
	<div class="loader">
		<div class="loader-inner ball-scale-multiple">
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</div>
</template>

<script>
	export default {};
</script>