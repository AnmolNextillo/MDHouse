export const getImage = image => {
    switch(image){
        case "show":return require("../assets/images/show.png")
        case "hide":return require("../assets/images/hide.jpg")
    }
}