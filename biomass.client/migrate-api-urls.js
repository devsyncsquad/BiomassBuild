#!/usr/bin/env node

/**
 * API URL Migration Script
 * 
 * This script helps identify files that still have hardcoded API URLs
 * and provides guidance on how to update them.
 * 
 * Usage: node migrate-api-urls.js
 */

const fs = require('fs');
const path = require('path');

// Patterns to search for
const patterns = [
  /https:\/\/localhost:7084\/api/g,
  /localhost:7084/g,
  /https:\/\/[^\/]+\/api/g
];

// Files to exclude from search
const excludeFiles = [
  'node_modules',
  'dist',
  '.git',
  'migrate-api-urls.js',
  'API_CENTRALIZATION_GUIDE.md',
  'config.js' // The config file itself should have the URL
];

// Directories to search
const searchDir = './src';

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!excludeFiles.includes(file)) {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  patterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        pattern: pattern.toString(),
        matches: matches,
        lines: getLineNumbers(content, pattern)
      });
    }
  });
  
  return issues;
}

function getLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });
  
  return lineNumbers;
}

function main() {
  console.log('🔍 Scanning for hardcoded API URLs...\n');
  
  const files = findFiles(searchDir);
  const filesWithIssues = [];
  
  files.forEach(file => {
    const issues = checkFile(file);
    if (issues.length > 0) {
      filesWithIssues.push({ file, issues });
    }
  });
  
  if (filesWithIssues.length === 0) {
    console.log('✅ No hardcoded API URLs found! All files are using the centralized configuration.');
    return;
  }
  
  console.log(`❌ Found ${filesWithIssues.length} files with hardcoded API URLs:\n`);
  
  filesWithIssues.forEach(({ file, issues }) => {
    console.log(`📁 ${file}`);
    issues.forEach(issue => {
      console.log(`   Pattern: ${issue.pattern}`);
      console.log(`   Lines: ${issue.lines.join(', ')}`);
      console.log(`   Matches: ${issue.matches.join(', ')}`);
    });
    console.log('');
  });
  
  console.log('📋 Migration Steps:');
  console.log('1. Import the centralized API client:');
  console.log('   import { apiCall } from "../utils/apiClient.js";');
  console.log('');
  console.log('2. Replace hardcoded URLs:');
  console.log('   // Before: axios.get("https://localhost:7084/api/users")');
  console.log('   // After:  apiCall.get("/users")');
  console.log('');
  console.log('3. For direct fetch calls:');
  console.log('   import { getApiUrl } from "../config/config.js";');
  console.log('   // Before: fetch("https://localhost:7084/api/users")');
  console.log('   // After:  fetch(getApiUrl("/users"))');
  console.log('');
  console.log('📖 See API_CENTRALIZATION_GUIDE.md for detailed instructions.');
}

main();
