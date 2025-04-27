/**
 * Creates a popup with customizable size, content, and dynamic buttons.
 *
 * @param {string} tag - The HTML element type (e.g., "p", "h1", "h3").
 * @param {string} content - The content to be placed inside the HTML element.
 * @param {Object} options - Options to customize the popup (e.g., size, background color, buttons).
 * @param {Array} buttons - An optional array of button objects, each with `label` and `action`.
 */
function createPopupWithButtons(tag, content, options = {}, buttons = []) {
    const { width = "300px", height = "200px", backgroundColor = "white", closeButton = true } = options;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.classList.add("popup-overlay");

    // Create the popup
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.style.width = width;
    popup.style.height = height;
    popup.style.backgroundColor = backgroundColor;

    // Set content inside popup
    const element = document.createElement(tag);
    element.innerHTML = content;
    popup.appendChild(element);

    // Add dynamic buttons
    if (buttons.length > 0) {
        buttons.forEach(button => {
            const btn = document.createElement("button");
            btn.textContent = button.label; // Set button label
            btn.classList.add("popup-button"); // Add a CSS class for styling (optional)
            btn.onclick = button.action; // Assign the action to the button
            popup.appendChild(btn); // Add button to the popup
        });
    }

    // Optionally add a close button
    if (closeButton) {
        const closeButtonElement = document.createElement("button");
        closeButtonElement.innerText = "Close";
        closeButtonElement.classList.add("close-btn");
        closeButtonElement.onclick = () => document.body.removeChild(overlay);
        popup.appendChild(closeButtonElement);
    }

    // Add popup to overlay and body
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Export the function if necessary
// export { createPopupWithButtons };