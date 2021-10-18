module.exports = function(sequelize, DataTypes){
    var email = sequelize.define("email",{
        no : { field: 'no', type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true},
        sendid : {field : 'send_id' , type: DataTypes.STRING(80)},
        sendmail : {field : 'send_email' , type: DataTypes.STRING(100)},
        touserid : { field: 'to_userid', type: DataTypes.STRING(80) },
        tomail : { field: 'to_mail', type: DataTypes.STRING(100) },
        title : {field : 'title' , type : DataTypes.STRING(100)},
        content : {field : 'content' , type : DataTypes.TEXT},
        regDate : {field : 'reg_date' , type : DataTypes.DATE},
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
            tableName: 'email'
    });
    return email;
  };