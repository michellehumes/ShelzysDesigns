/**
 * Master Setup Script
 * Runs all automation scripts in sequence
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scripts = [
  { name: 'Create Collections', file: 'create-collections.js' },
  { name: 'Create Pages', file: 'create-pages.js' },
  { name: 'Update Products', file: 'update-products.js' },
  { name: 'Verify Setup', file: 'verify-setup.js' },
];

async function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: dirname(scriptPath),
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     SHELZY\'S DESIGNS - AUTOMATED SHOPIFY SETUP            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`Step ${i + 1}/${scripts.length}: ${script.name}`);
    console.log('═'.repeat(60));

    try {
      await runScript(join(__dirname, script.file));
      console.log(`✅ ${script.name} completed successfully`);
    } catch (error) {
      console.error(`❌ ${script.name} failed:`, error.message);
      console.log('\nContinuing with next step...');
    }

    // Small delay between scripts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 SETUP COMPLETE!');
  console.log('═'.repeat(60));
  console.log(`
Next steps:
1. Visit your store: https://shelzysdesigns.com
2. Verify all pages and collections work
3. Update announcement bar (remove "500+ reviews" claim)
4. Install Judge.me for real reviews

Manual tasks (cannot be automated):
- Update announcement bar text in theme editor
- Configure shipping policy in Settings > Policies
- Set up email marketing (Klaviyo/Mailchimp)
`);
}

main().catch(console.error);
