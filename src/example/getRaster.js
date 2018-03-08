/* eslint-disable react/no-multi-comp,
    react/jsx-indent,
    react/jsx-indent-props,
    react/prop-types */
import * as d3 from "d3";
import { paper } from "paper";

export async function getRaster() {
    const hi = handleImage.bind(this);

    function onChange() {
        const file = this.files[0];

        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

            img.onload = () => {
                hi(reader.result, img.width, img.height);
            };

            img.src = reader.result;
        };

        reader.readAsDataURL(file);
    }

    const rasterInput = document.createElement("input");
    rasterInput.type = "file";
    rasterInput.id = "rasterInput";
    rasterInput.accept = "image/*";
    rasterInput.style = "display:none";
    rasterInput.onchange = onChange;

    rasterInput.click();

    async function handleImage(rasterPath, fullWidth, fullHeight) {
        // Load the raster in an `svg:image` element
        const svgRaster = await new Promise((resolve, reject) => {
            d3
                .create("svg:image")
                .attr("href", rasterPath)
                // eslint-disable-next-line func-names
                .attr("onload", function () {
                    resolve(this);
                })
                .attr("onerror", () =>
                    reject(new Error(`D3 failed to load the image at
                    ${rasterPath}`)));
        });

        const { width, height } = calcRasterScale(fullWidth, fullHeight);
        function calcRasterScale(fullWidth, fullHeight) {
            const width = 1200;
            const height = fullHeight / fullWidth * width;

            return { width, height };
        }

        // Set dimensions of SVG and canvas to the same size as the raster
        this.d3Project.svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

        this.pjsProject.view.viewSize = new paper.Size(width, height);

        // Append raster to SVG and set dimensions
        // (i.e. append the `svg:image` element created above to the SVG)
        this.d3Project.svg
            .append(() => svgRaster)
            .attr("width", width)
            .attr("height", height);

        // Create Paper.js raster.
        const pjsRaster = await new Promise((resolve, reject) => {
            const raster = new paper.Raster(rasterPath);
            raster.onLoad = () => resolve(raster);
            raster.onError = () =>
                reject(new Error(`Paper.js failed to load the image at 
                ${rasterPath}`));
        });
        // Set dimensions of Paper.js raster
        const maxBox = new paper.Rectangle(this.pjsProject.view.viewSize);
        pjsRaster.fitBounds(maxBox);

        // Save useful stuff to project objects
        Object.assign(this.d3Project, {});
        Object.assign(this.pjsProject, { pjsRaster });
        Object.assign(this.data, {});
    }
}
