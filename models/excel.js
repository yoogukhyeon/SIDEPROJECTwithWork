module.exports = function(sequelize, DataTypes){
    var reviews = sequelize.define("reviews",{
        no : { field: 'no', type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true},
        prodSeq : {field : 'prod_seq' , type: DataTypes.INTEGER(11)},
        prodType : {field : 'prod_type' , type: DataTypes.STRING(16)},
        writer : { field: 'writer', type: DataTypes.STRING(16) },
        content : { field: 'content', type: DataTypes.STRING(300) },
        star : {field : 'star' , type : DataTypes.INTEGER(1)},
        useYn : {field : 'use_yn', type: DataTypes.CHAR(1)},
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
            tableName: 'p_reviews'
    });
    return reviews;
  };