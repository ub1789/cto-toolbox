import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

export interface InstallOptions {
  templatesDir?: string;
  dryRun?: boolean;
}

export async function installAssets(options: InstallOptions = {}) {
  const home = os.homedir();
  const agentsDir = path.join(home, '.claude', 'agents');
  const skillsDir = path.join(home, '.claude', 'skills');
  const commandsDir = path.join(home, '.claude', 'commands');
  const templatesDir = options.templatesDir || path.join(home, 'cto-toolbox', 'templates');

  const packageAssetsDir = path.join(process.cwd(), 'assets');

  const targets = [
    { key: 'agents', srcDir: path.join(packageAssetsDir, 'agents'), destDir: agentsDir },
    { key: 'skills', srcDir: path.join(packageAssetsDir, 'skills'), destDir: skillsDir },
    { key: 'commands', srcDir: path.join(packageAssetsDir, 'commands'), destDir: commandsDir },
    { key: 'templates', srcDir: path.join(packageAssetsDir, 'templates'), destDir: templatesDir },
  ] as const;

  const results: Record<string, { installed: number; skipped: number }> = {};

  if (options.dryRun) {
    console.log('--- Dry Run: No files will be modified ---');
  }

  for (const { key, srcDir, destDir } of targets) {
    results[key] = { installed: 0, skipped: 0 };
    if (!options.dryRun) await fs.ensureDir(destDir);

    const entries = await fs.readdir(srcDir);
    for (const entry of entries) {
      const src = path.join(srcDir, entry);
      const dest = path.join(destDir, entry);

      if (await shouldUpdate(src, dest)) {
        if (!options.dryRun) await fs.copy(src, dest);
        results[key].installed++;
      } else {
        results[key].skipped++;
      }
    }
  }

  return { results, paths: { agentsDir, skillsDir, commandsDir, templatesDir } };
}

async function shouldUpdate(src: string, dest: string): Promise<boolean> {
  if (!(await fs.pathExists(dest))) return true;
  return (await hashPath(src)) !== (await hashPath(dest));
}

async function hashPath(target: string): Promise<string> {
  const stat = await fs.stat(target);
  const hash = crypto.createHash('sha256');

  if (stat.isFile()) {
    hash.update(await fs.readFile(target));
    return hash.digest('hex');
  }

  const entries = (await fs.readdir(target)).sort();
  for (const entry of entries) {
    hash.update(entry);
    hash.update(await hashPath(path.join(target, entry)));
  }
  return hash.digest('hex');
}

export async function listAssets() {
  const home = os.homedir();
  const agentsDir = path.join(home, '.claude', 'agents');
  const commandsDir = path.join(home, '.claude', 'commands');
  const templatesDir = path.join(home, 'cto-toolbox', 'templates');

  const installedAgents = await fs.pathExists(agentsDir) ? await fs.readdir(agentsDir) : [];
  const installedCommands = await fs.pathExists(commandsDir) ? await fs.readdir(commandsDir) : [];
  const installedTemplates = await fs.pathExists(templatesDir) ? await fs.readdir(templatesDir) : [];

  return { installedAgents, installedCommands, installedTemplates };
}
