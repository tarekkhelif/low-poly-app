import { curry } from "./util/funcTools.js";
import { camelize } from "./util/stringTools.js";

export function setUpUI() {
    // Workspace div
    const workspace = document.createElement("div");
    workspace.id = "workspace";
    document.body.appendChild(workspace);

    // Make list of stages
    const stages = [
        { name: "Set Up", function: this.setUpWorkspace.bind(this, workspace) },
        { name: "Get Image", function: this.getRaster.bind(this) },
        { name: "Outline Image", function: this.outlineRaster.bind(this) },
        { name: "Place Seeds", function: this.generateSites.bind(this, 100) },
        { name: "Draw Tesselation", function: this.generateVoronoi.bind(this) },
        { name: "Edit Tesselation", function: this.editTesselation.bind(this) },
        {
            name: "Export",
            function: () =>
                console.log("Sorry, exporting your art isn't supported yet.")
        }
    ];

    // Buttons div
    const buttons = document.createElement("div");
    buttons.id = "buttons";
    document.body.insertBefore(buttons, workspace);

    // Add buttons
    stages.forEach((stage, i) => {
        const stageButton = document.createElement("button");
        stageButton.id = camelize(stage.name);
        stageButton.innerHTML = stage.name;
        if (i > 0) stageButton.disabled = true;
        stageButton.addEventListener("click", async (e) => {
            await stage.function();
            buttons.childNodes[i].disabled = true;
            if (i + 1 < buttons.childNodes.length) {
                buttons.childNodes[i + 1].disabled = false;
            }
        });
        buttons.appendChild(stageButton);
    });
}
