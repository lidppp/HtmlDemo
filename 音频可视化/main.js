// 第一种 利用audio标签生成
let audioDom = document.querySelector("audio")
let can = document.querySelector("#can")
let canCtx = can.getContext("2d")
canCtx.strokeStyle = 'red';
canCtx.fillStyle = "green";
canCtx.beginPath();
canCtx.moveTo(0, can.height / 2);
canCtx.lineTo(can.width, can.height / 2);
canCtx.stroke();
canCtx.closePath();

canCtx.beginPath();
canCtx.moveTo(can.width / 2, 0);
canCtx.lineTo(can.width / 2, can.height);
canCtx.stroke();
canCtx.closePath();





// 登录状态下不会出现这行文字，点击页面右上角一键登录

let pointArr = []
canCtx.beginPath()
for (let i = 0; i <= 128; i++) {
    var x1 = 400 + 150 * Math.cos(2 * (Math.PI / 128) * i);
    var y1 = 220 + 150 * Math.sin(2 * (Math.PI / 128) * i);

    if(i === 0){
        canCtx.moveTo(x1, y1);
    }
    canCtx.lineTo(x1, y1);

    pointArr.push({
        x:Math.cos(2 * (Math.PI / 128) * i),
        y:Math.sin(2 * (Math.PI / 128) * i)
    })

}
canCtx.stroke();



document.onclick = () => {
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    let analyser = audioCtx.createAnalyser(); // 创建分析器节点
    analyser.fftSize = 256;
    let source = audioCtx.createMediaElementSource(audioDom)  // 获取音源
    /*
    输入 -> 分析器 -> 播放器
    * */
    source.connect(analyser); //音源链接到AnalyserNode分析器节点中
    analyser.connect(audioCtx.destination); // 连接到audioContext.destination才能听到声音。
    let bufferLength = analyser.frequencyBinCount;  // frequencyBinCount 的值固定为 AnalyserNode 接口中fftSize值的一半. 该属性通常用于可视化的数据值的数量.
    var dataArr = new Uint8Array(bufferLength);
    let can_width = can.width, can_height = can.height, rectWidth = can_width / bufferLength;
    var gradientLinear = canCtx.createLinearGradient(0, 0, 0, can_height);
    gradientLinear.addColorStop(0, 'red');
    gradientLinear.addColorStop(1, 'green');
    canCtx.strokeStyle = gradientLinear;

    audioDom.onplay = function getData() {
        canCtx.clearRect(0, 0, can_width, can_height);
        // 坐标位移
        canCtx.translate(400, 220);
        // 旋转45度
        canCtx.rotate(160 * Math.PI / 180);
        canCtx.translate(-400, -220);
        analyser.getByteFrequencyData(dataArr);
        canCtx.beginPath()
        for (let i = 0; i < bufferLength; i++) {
            var x1 = 400 + 150 * pointArr[i].x * (dataArr[i] / 400 +1);
            var y1 = 220 + 150 * pointArr[i].y * (dataArr[i] / 400 +1);

            if(i === 0){
                canCtx.moveTo(x1, y1);
            }else{
                let x2 = 400 + 150 * pointArr[i-1].x;
                let y2 = 220 + 150 * pointArr[i-1].y;
                canCtx.quadraticCurveTo(x2, y2, x1, y1);
                // canCtx.lineTo(x2, y2);
            }
            // canCtx.lineTo(x1, y1);
            if(i === bufferLength-1){
                let x2 = 400 + 150 * pointArr[0].x * (dataArr[0] / 400 +1);
                let y2 = 220 + 150 * pointArr[0].y * (dataArr[0] / 400 +1);
                // canCtx.quadraticCurveTo(x2, y2, x1, y1);
                canCtx.lineTo(x2, y2);
            }
            // canCtx.fillStyle = gradientLinear
            // canCtx.fillRect(rectWidth * i, can_height - dataArr[i], rectWidth, can_height)
        }
        canCtx.stroke();
        // 坐标位移
        canCtx.translate(400, 220);
        // 旋转45度
        canCtx.rotate(-160 * Math.PI / 180);
        canCtx.translate(-400, -220);

        requestAnimationFrame(getData)
    }

    document.onclick = null
}



