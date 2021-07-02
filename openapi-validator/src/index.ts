#!/usr/bin/env node
import { Command } from 'commander';
import { validate } from './validate';
const program = new Command();

program.command('validate')
	.argument('<file>')
	.description('Validate OpenAPI files')
	.action(validate)
	.version('0.1.0')

program.parse(process.argv)