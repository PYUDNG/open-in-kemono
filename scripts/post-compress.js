import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { transform } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');

// 配置
const config = {
  // 构建输出的无压缩文件（greasyfork版本）
  uncompressedFile: 'open-in-kemono.greasyfork.user.js',
  // 后处理生成的压缩文件（一般版本）
  compressedFile: 'open-in-kemono.user.js',
  esbuildOptions: {
    minify: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    target: 'es2020',
    charset: 'utf8',
  }
};

// 提取用户脚本头部注释块
function extractUserScriptHeader(code) {
  const lines = code.split('\n');
  let headerEndIndex = -1;
  
  // 查找头部注释块的结束位置
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '// ==/UserScript==') {
      headerEndIndex = i;
      break;
    }
  }
  
  if (headerEndIndex === -1) {
    throw new Error('未找到用户脚本头部注释块结束标记 (// ==/UserScript==)');
  }
  
  // 提取头部注释块（包含结束标记）
  const headerLines = lines.slice(0, headerEndIndex + 1);
  const header = headerLines.join('\n');
  
  // 提取代码部分（头部注释块之后的内容）
  const codeLines = lines.slice(headerEndIndex + 1);
  const codeBody = codeLines.join('\n');
  
  return { header, code: codeBody };
}

async function postCompress() {
  try {
    console.log('🚀 开始后压缩处理...');
    
    // 1. 读取无压缩的构建版本
    const inputPath = join(distDir, config.uncompressedFile);
    const outputPath = join(distDir, config.compressedFile);
    
    console.log(`📖 读取文件: ${config.uncompressedFile}`);
    const originalCode = readFileSync(inputPath, 'utf8');
    
    // 2. 分离头部注释和代码部分
    console.log('🔍 提取用户脚本头部注释...');
    const { header, code: codeBody } = extractUserScriptHeader(originalCode);
    
    // 3. 使用 esbuild 压缩代码部分（不压缩头部注释）
    console.log('⚡ 使用 esbuild 压缩代码部分...');
    const result = await transform(codeBody, config.esbuildOptions);
    
    // 4. 合并头部注释和压缩后的代码
    const compressedCode = header + '\n\n' + result.code;
    
    // 5. 写入压缩后的版本
    console.log(`💾 写入压缩版本: ${config.compressedFile}`);
    writeFileSync(outputPath, compressedCode, 'utf8');
    
    // 6. 输出文件大小信息
    const originalSize = Buffer.byteLength(originalCode, 'utf8');
    const compressedSize = Buffer.byteLength(compressedCode, 'utf8');
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    console.log('\n📊 压缩结果:');
    console.log(`  原始文件: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  压缩文件: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`  压缩率: ${compressionRatio}%`);
    console.log(`  节省空间: ${((originalSize - compressedSize) / 1024).toFixed(2)} KB`);
    
    console.log('\n✅ 后压缩处理完成！');
    console.log(`  调试版本: dist/${config.uncompressedFile} (未压缩)`);
    console.log(`  发布版本: dist/${config.compressedFile} (已压缩，保留头部注释)`);
    
  } catch (error) {
    console.error('❌ 后压缩处理失败:', error);
    process.exit(1);
  }
}

// 执行后压缩处理
postCompress();