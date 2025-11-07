export function GetDOMElForInputType(Identifier){
    if (typeof(Identifier) === 'string')
    {
        Identifier = document.getElementById(Identifier);
    }
    if (!(Identifier instanceof HTMLElement))
    {
        console.log("Invalid gallery type: " + Identifier.type + " (expected String or HTMLElement)");
    }
    return Identifier;
}