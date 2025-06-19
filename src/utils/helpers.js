export function setButtonText(btn, isLoading, defualtText = "Save", loadingText = "Saving...") {
    if (isLoading) {
        btn.innerText = loadingText
    } else {
        btn.innerText = defualtText
    }
}