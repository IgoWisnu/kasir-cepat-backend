const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'docs', 'db_schema.md');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

const createTableRegex = /CREATE TABLE `?([a-zA-Z0-9_]+)`?\s*\(([\s\S]*?)\);/g;

const tables = [];
let match;
while ((match = createTableRegex.exec(schemaContent)) !== null) {
  const tableName = match[1];
  const columnsStr = match[2];
  
  const columns = [];
  const foreignKeys = [];
  const lines = columnsStr.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('--'));
  
  for (const line of lines) {
    if (line.toUpperCase().startsWith('FOREIGN KEY')) {
      const fkMatch = line.match(/FOREIGN KEY\s*\(`?([a-zA-Z0-9_]+)`?\)\s*REFERENCES\s*`?([a-zA-Z0-9_]+)`?\s*\(`?([a-zA-Z0-9_]+)`?\)/i);
      if (fkMatch) {
         foreignKeys.push({
           col: fkMatch[1],
           targetTable: fkMatch[2],
           targetCol: fkMatch[3]
         });
      }
      continue;
    }
    if (line.toUpperCase().startsWith('PRIMARY KEY')) continue;
    
    // Parse column
    const colMatch = line.match(/^`?([a-zA-Z0-9_]+)`?\s+([a-zA-Z0-9_]+(\([^)]+\))?)/);
    if (colMatch) {
      columns.push({
        name: colMatch[1],
        typeStr: colMatch[2].toUpperCase(),
        original: line
      });
    }
  }
  
  let modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
  if (modelName === 'Order') modelName = 'Order';
  if (modelName === 'User') modelName = 'User';
  // Standardize naming
  const standardizedModelName = ['Outlet', 'Business', 'Subscription', 'User', 'Order', 'Shift', 'Unit', 'Discount', 'Item', 'Inventory', 'Payments'].includes(modelName) ? modelName : modelName;

  tables.push({ tableName, modelName: standardizedModelName, columns, foreignKeys, original: columnsStr });
}

tables.forEach(table => {
  // Try to normalize Model name based on targetTable
  table.foreignKeys.forEach(fk => {
     const target = tables.find(t => t.tableName.toLowerCase() === fk.targetTable.toLowerCase());
     if (target) {
        fk.targetModelName = target.modelName;
     } else {
        // Fallback
        fk.targetModelName = fk.targetTable.charAt(0).toUpperCase() + fk.targetTable.slice(1);
     }
  });
});

function mapType(mysqlType) {
  if (mysqlType.startsWith('INT')) return 'DataTypes.INTEGER';
  if (mysqlType.startsWith('VARCHAR')) return 'DataTypes.STRING';
  if (mysqlType.startsWith('DECIMAL')) return 'DataTypes.DECIMAL';
  if (mysqlType.startsWith('TEXT')) return 'DataTypes.TEXT';
  if (mysqlType.startsWith('BOOLEAN')) return 'DataTypes.BOOLEAN';
  if (mysqlType.startsWith('ENUM')) return 'DataTypes.ENUM';
  if (mysqlType.startsWith('DATETIME') || mysqlType.startsWith('TIMESTAMP')) return 'DataTypes.DATE';
  return 'DataTypes.STRING';
}

tables.forEach(table => {
  const { tableName, modelName, columns, foreignKeys } = table;
  
  const fileName = tableName.toLowerCase() + '.model.js';
  
  let hasCreatedAt = false;
  let hasUpdatedAt = false;
  let hasDeletedAt = false;
  
  const attrLines = columns.map(col => {
    if (col.name === 'id') {
      return `    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }`;
    }
    
    if (col.name === 'created_at') { hasCreatedAt = true; return null; }
    if (col.name === 'updated_at') { hasUpdatedAt = true; return null; }
    if (col.name === 'deleted_at') { hasDeletedAt = true; return null; }
    
    let typeDef = mapType(col.typeStr);
    if (typeDef === 'DataTypes.ENUM') {
      const enumMatch = col.original.match(/ENUM\(([^)]+)\)/i);
      if (enumMatch) {
         typeDef = `DataTypes.ENUM(${enumMatch[1]})`;
      }
    } else if (typeDef === 'DataTypes.DECIMAL') {
      const decMatch = col.original.match(/DECIMAL\(([^)]+)\)/i);
      if (decMatch) {
         typeDef = `DataTypes.DECIMAL(${decMatch[1]})`;
      }
    }
    
    let isAllowNull = !col.original.toUpperCase().includes('NOT NULL');
    if (col.original.toUpperCase().includes('PRIMARY KEY')) isAllowNull = false;
    
    return `    ${col.name}: {
      type: ${typeDef},
      allowNull: ${isAllowNull}
    }`;
  }).filter(Boolean);

  const belongsToLines = foreignKeys.map(fk => {
     return `    ${modelName}.belongsTo(models.${fk.targetModelName}, { foreignKey: '${fk.col}' });`;
  });

  // Calculate hasMany lines
  const hasManyLines = [];
  tables.forEach(t => {
     t.foreignKeys.forEach(fk => {
        if (fk.targetModelName === modelName) {
           hasManyLines.push(`    ${modelName}.hasMany(models.${t.modelName}, { foreignKey: '${fk.col}' });`);
        }
     });
  });

  const associationLines = [...belongsToLines, ...hasManyLines];

  const modelContent = `module.exports = (sequelize, DataTypes) => {
  const ${modelName} = sequelize.define('${modelName}', {
${attrLines.join(',\n')}
  }, {
    tableName: '${tableName}',
    timestamps: ${hasCreatedAt || hasUpdatedAt || hasDeletedAt},
${hasCreatedAt ? "    createdAt: 'created_at'," : "    createdAt: false,"}
${hasUpdatedAt ? "    updatedAt: 'updated_at'," : "    updatedAt: false,"}
${hasDeletedAt ? "    paranoid: true,\n    deletedAt: 'deleted_at'," : ""}
  });

  ${modelName}.associate = (models) => {
${associationLines.join('\n')}
  };

  return ${modelName};
};
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'models', fileName), modelContent);
  console.log('Created ' + fileName);
});

console.log('Done mapping models with relations!');
