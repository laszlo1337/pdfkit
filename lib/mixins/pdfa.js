import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dataPath from '../fontPathResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dataPath ?? path.dirname(__filename);

export default {

    initPDFA(pSubset) {
        if (pSubset.charAt(pSubset.length - 3) === '-') {
            this.subset_conformance = pSubset.charAt(pSubset.length - 1).toUpperCase();
            this.subset = parseInt(pSubset.charAt(pSubset.length - 2));
        } else {
            // Default to Basic conformance when user doesn't specify
            this.subset_conformance = 'B';
            this.subset = parseInt(pSubset.charAt(pSubset.length - 1));
        }
    },

    endSubset() {
        this._addPdfaMetadata();
        const jsPath = `${__dirname}/data/sRGB_IEC61966_2_1.icc`
        const jestPath = `${__dirname}/../color_profiles/sRGB_IEC61966_2_1.icc`
        this._addColorOutputIntent(fs.existsSync(jsPath) ? jsPath : jestPath);
    },

    _addColorOutputIntent(pICCPath) {
        const iccProfile = fs.readFileSync(pICCPath);

        const colorProfileRef = this.ref({
            Length: iccProfile.length,
            N: 3
        });
        colorProfileRef.write(iccProfile);
        colorProfileRef.end();

        const intentRef = this.ref({
            Type: 'OutputIntent',
            S: 'GTS_PDFA1',
            Info: new String('sRGB IEC61966-2.1'),
            OutputConditionIdentifier: new String('sRGB IEC61966-2.1'),
            DestOutputProfile: colorProfileRef,
        });
        intentRef.end();

        this._root.data.OutputIntents = [intentRef];
    },

    _getPdfaid() {
        return `
        <rdf:Description xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/" rdf:about="">
            <pdfaid:part>${this.subset}</pdfaid:part>
            <pdfaid:conformance>${this.subset_conformance}</pdfaid:conformance>
        </rdf:Description>
        `;
    },

    _addPdfaMetadata() {
        this.appendXML(this._getPdfaid());
    },

}