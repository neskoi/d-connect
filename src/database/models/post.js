module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post',{
    
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_post_tag:{allowNull: false, type: DataTypes.INTEGER, references:{model:'Tag', key: 'id'}},
    title_en:{allowNull: true, type: DataTypes.STRING},
    post_en:{allowNull: true, type: DataTypes.TEXT},
    title_jp:{allowNull: true, type: DataTypes.STRING},
    post_jp:{allowNull: true, type: DataTypes.TEXT},
    title_pt:{allowNull: true, type: DataTypes.STRING},
    post_pt:{allowNull: true, type: DataTypes.TEXT},
    title_sp:{allowNull: true, type: DataTypes.STRING},
    post_sp:{allowNull: true, type: DataTypes.TEXT},

  },{updatedAt: false});
  
  Post.associate = function(models) {
    Post.belongsTo(models.Tag, {foreignKey: 'fk_post_tag', onDelete: 'cascade' });
  };

  return Post;
};