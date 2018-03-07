import FileSaver from "file-saver";

export const exportArt = () => {
    const svg = document.querySelector("#svgProject");
    const data = (new XMLSerializer()).serializeToString(svg);
    const svgFile = new File([data], { type: "image/svg+xml;charset=utf-8" });
    FileSaver.saveAs(svgFile, "low-poly-project.svg");
};
