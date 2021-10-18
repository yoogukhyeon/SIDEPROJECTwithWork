module.exports = function(sequelize, DataTypes){
    var member = sequelize.define("user",{
        no : { field: 'mem_no', type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true},
        email : { field: 'mem_email', type: DataTypes.STRING(64) },
        password : { field: 'mem_pwd', type: DataTypes.STRING(300) },
        salt : {
            field : 'mem_salt' , type : DataTypes.STRING(300)
        },
        name : { field: 'mem_name', type: DataTypes.STRING(16) },
        phone : { field: 'mem_phone', type: DataTypes.STRING(40) },
        regDate : { field: 'reg_date', type: DataTypes.DATE(1) },
        }, {
           // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: false,
      
            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,
      
            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,
      
            // define the table's name
            tableName: 'member'
    });
    return member;
  };