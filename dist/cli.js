import { Command } from 'commander';
import chalk from 'chalk';
import { installAssets, listAssets } from './installer.js';
import { mergeRecommendedSettings } from './config.js';
const program = new Command();
program
    .name('cto-toolbox')
    .description('Installer for the UB Labs CTO agent and skill ecosystem')
    .version('0.1.0');
program
    .command('install')
    .description('Bootstrap the CTO Toolbox environment')
    .option('-t, --templates <path>', 'Custom path for templates')
    .option('--dry-run', 'Preview changes without applying')
    .action(async (options) => {
    try {
        console.log(chalk.blue('🚀 Starting CTO Toolbox installation...'));
        const { results, paths } = await installAssets({
            templatesDir: options.templates,
            dryRun: options.dryRun
        });
        console.log(chalk.green(`\n✅ Agents: ${results.agents.installed} installed, ${results.agents.skipped} skipped`));
        console.log(chalk.green(`✅ Skills: ${results.skills.installed} installed, ${results.skills.skipped} skipped`));
        console.log(chalk.green(`✅ Templates: ${results.templates.installed} installed, ${results.templates.skipped} skipped`));
        if (!options.dryRun) {
            const { updated } = await mergeRecommendedSettings();
            if (updated) {
                console.log(chalk.yellow('⚙️  Recommended settings merged into ~/.claude/settings.json'));
            }
            else {
                console.log(chalk.dim('⚙️  Settings already up-to-date'));
            }
        }
        console.log(`\n${chalk.bold('Quick Start:')}`);
        console.log(`- Agents deployed to: ${chalk.cyan(paths.agentsDir)}`);
        console.log(`- Templates deployed to: ${chalk.cyan(paths.templatesDir)}`);
        console.log(`\n${chalk.green('Done! Restart your Claude Code session to use the new agents.')}`);
    }
    catch (error) {
        console.error(chalk.red('\n❌ Installation failed:'), error);
        process.exit(1);
    }
});
program
    .command('list')
    .description('List installed CTO Toolbox assets')
    .action(async () => {
    const { installedAgents, installedTemplates } = await listAssets();
    console.log(chalk.blue('\nInstalled Agents:'));
    installedAgents.filter((a) => a.startsWith('p0-') || a.startsWith('repolens-')).forEach((a) => console.log(` - ${a}`));
    console.log(chalk.blue('\nInstalled Templates:'));
    installedTemplates.forEach((t) => console.log(` - ${t}`));
});
program.parse();
