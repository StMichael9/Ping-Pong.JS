 document.getElementById("paddle1");
const moveAmount = 15;
let x = 0;
let y = 0;

document.addEventListener("keydown", event => {
    if(event.key.startsWith("Arrow")){

        event.preventDefault();

        switch(event.key){
           
            case "ArrowUp":
                y -= moveAmount;
                break;
               
                case "ArrowDown":
                y += moveAmount;
                break;
              
                case "ArrowLeft":
                    x -= moveAmount;
                    break;
              
                    case "ArrowRight":
                        x += moveAmount;
                        break;

        }
        paddle1.style.top = `${y}px`;
        paddle1.style.left = `${x}px`;
    }
});


document.addEventListener("keyup", event => {
    console.log(`Key up = ${event.key}`)
});