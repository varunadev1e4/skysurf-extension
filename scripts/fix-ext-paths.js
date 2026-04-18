import { readFileSync, writeFileSync, existsSync } from 'fs'

const targets = ['dist/sidepanel.html', 'dist/popup.html']
targets.forEach(path => {
  if (!existsSync(path)) return
  const html = readFileSync(path, 'utf8')
  const fixed = html.replace(/src="\/assets\//g, 'src="assets/').replace(/href="\/assets\//g, 'href="assets/')
  writeFileSync(path, fixed)
  console.log(`✓ Fixed asset paths in ${path}`)
})
