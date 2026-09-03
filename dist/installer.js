import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
export async function installAssets(options = {}) {
    const home = os.homedir();
    const agentsDir = path.join(home, '.claude', 'agents');
    const skillsDir = path.join(home, '.claude', 'skills');
    const templatesDir = options.templatesDir || path.join(home, 'cto-toolbox', 'templates');
    const packageAssetsDir = path.join(process.cwd(), 'assets');
    const packageAgentsDir = path.join(packageAssetsDir, 'agents');
    const packageTemplatesDir = path.join(packageAssetsDir, 'templates');
    const results = {
        agents: { installed: 0, updated: 0, skipped: 0 },
        skills: { installed: 0, updated: 0, skipped: 0 },
        templates: { installed: 0, updated: 0, skipped: 0 },
    };
    if (options.dryRun) {
        console.log('--- Dry Run: No files will be modified ---');
    }
    // Ensure directories exist
    if (!options.dryRun) {
        await fs.ensureDir(agentsDir);
        await fs.ensureDir(skillsDir);
        await fs.ensureDir(templatesDir);
    }
    // Install Agents
    const agents = await fs.readdir(packageAgentsDir);
    for (const agent of agents) {
        const src = path.join(packageAgentsDir, agent);
        const dest = path.join(agentsDir, agent);
        if (await shouldUpdate(src, dest)) {
            if (!options.dryRun)
                await fs.copy(src, dest);
            results.agents.installed++;
        }
        else {
            results.agents.skipped++;
        }
    }
    // Install Skills
    const packageSkillsDir = path.join(packageAssetsDir, 'skills');
    const skills = await fs.readdir(packageSkillsDir);
    for (const skill of skills) {
        const src = path.join(packageSkillsDir, skill);
        const dest = path.join(skillsDir, skill);
        if (await shouldUpdate(src, dest)) {
            if (!options.dryRun)
                await fs.copy(src, dest);
            results.skills.installed++;
        }
        else {
            results.skills.skipped++;
        }
    }
    // Install Templates
    const templates = await fs.readdir(packageTemplatesDir);
    for (const template of templates) {
        const src = path.join(packageTemplatesDir, template);
        const dest = path.join(templatesDir, template);
        if (await shouldUpdate(src, dest)) {
            if (!options.dryRun)
                await fs.copy(src, dest);
            results.templates.installed++;
        }
        else {
            results.templates.skipped++;
        }
    }
    return { results, paths: { agentsDir, templatesDir } };
}
async function shouldUpdate(src, dest) {
    if (!(await fs.pathExists(dest)))
        return true;
    const srcBuf = await fs.readFile(src);
    const destBuf = await fs.readFile(dest);
    const srcHash = crypto.createHash('sha256').update(srcBuf).digest('hex');
    const destHash = crypto.createHash('sha256').update(destBuf).digest('hex');
    return srcHash !== destHash;
}
export async function listAssets() {
    const home = os.homedir();
    const agentsDir = path.join(home, '.claude', 'agents');
    const templatesDir = path.join(home, 'cto-toolbox', 'templates');
    const installedAgents = await fs.pathExists(agentsDir) ? await fs.readdir(agentsDir) : [];
    const installedTemplates = await fs.pathExists(templatesDir) ? await fs.readdir(templatesDir) : [];
    return { installedAgents, installedTemplates };
}
