import { isOpenApiv3, Spectral, Document, Parsers, IRuleResult, isOpenApiv2 } from "@stoplight/spectral"
import errorSchema from "../spectral/functions/errorResponse";
import expectServersConfig from "../spectral/functions/expectServersConfig";
import objectReferenceSchema from '../spectral/functions/objectReferenceSchema'
import resourceSchema from '../spectral/functions/resourceSchema'
import securitySchemes from '../spectral/functions/securitySchemes'
import infoLicenseApache2 from '../spectral/functions/infoLicenseApache2'
import schemaDefinition from "../spectral/functions/schemaDefinition";
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import chalk from 'chalk'
import rules from "../spectral/rulesets/rules";

// Validate the OpenAPI file against the RHOAS rules
export async function validate(filePath: string) {
	const pathToFile = path.resolve(filePath)
	if (!existsSync(pathToFile)) {
		console.log(`
File ${colorDim(filePath)} does not exist.
		`)
		process.exit(1);
	}
	const spectral = new Spectral()
	spectral.registerFormat("oas3", isOpenApiv3);
	spectral.registerFormat("oas2", isOpenApiv2)
	await spectral.loadRuleset('spectral:oas')

	const functions = {
		errorSchema,
		expectServersConfig,
		objectReferenceSchema,
		resourceSchema,
		securitySchemes,
		infoLicenseApache2,
		schemaDefinition
	}
	spectral.setFunctions(functions)
	const data = readFileSync(pathToFile);

	const fileExtension = path.extname(filePath);
	let document: Document
	if (fileExtension === '.yaml' || fileExtension === '.yml') {
		document = new Document(data.toString(), Parsers.Yaml)
	} else {
		document = new Document(data.toString(), Parsers.Json)
	}


	spectral.setRules(rules);

	// Validate the OpenAPI file using Spectral and print the results to the console
	// spectral.loadRuleset(path.join(__dirname, '../spectral/rulesets/ruleset.yaml')).then(() => spectral.run(document)).then((results: IRuleResult[]) => {
	spectral.run(document).then((results: IRuleResult[]) => {
		let totalErrors = 0, totalWarnings = 0;
		results.forEach((r => {
			if (r.severity == 0) {
				totalErrors++
			} else if (r.severity == 1) {
				totalWarnings++;
			}
			printResult(r, pathToFile)
		}))
		const totalProblems = totalErrors + totalWarnings;
		if (totalProblems > 0) {
			console.log(colorError(`✖ ${totalProblems} problem${totalProblems === 1 ? '' : 's'} (${totalErrors} error${totalErrors === 1 ? '' : 's'}, ${totalWarnings} warning${totalWarnings === 1 ? '' : 's'})\n`));
			process.exit(1)
		} else {
			console.log('No problems were found.');
		}
	}).catch((e => console.log(e)))
}

// Print the validation result in a readable format
function printResult(result: IRuleResult, pathToFile: string) {
	const codeConfig = severityCodeConfigMap[result.severity]
	console.log(`${pathToFile}
  ${colorDim(result.range.start.line)}:${colorDim(result.range.end.line)}  ${codeConfig.color(codeConfig.code)}	${result.message}   ${colorDim(result?.path.join('.'))}
	`)
}

// define the common colors to use in the CLI
const colorDim = chalk.dim
const colorError = chalk.red
const colorWarn = chalk.yellow
const colorInfo = chalk.cyan

// map spectral severity code to human-readable text and an appopriate color
const severityCodeConfigMap = {
	0: {
		code: 'error',
		color: colorError
	},
	1: {
		code: 'warning',
		color: colorWarn
	},
	2: {
		code: 'info',
		color: colorInfo,
	},
	3: {
		code: 'hint',
		color: colorInfo
	}
}