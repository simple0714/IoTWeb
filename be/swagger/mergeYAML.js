const YAML = require('yamljs');
const path = require('path');

const mergeYAML = () => {
  const base = YAML.load(path.join(__dirname, './swagger.yaml'));
  const about = YAML.load(path.join(__dirname, './path/About.yaml'));
  const project = YAML.load(path.join(__dirname, './path/Project.yaml'));
  const partner = YAML.load(path.join(__dirname, './path/Partner.yaml'));
  const contact = YAML.load(path.join(__dirname, './path/Contact.yaml'));
  const service = YAML.load(path.join(__dirname, './path/Service.yaml'));
  const file = YAML.load(path.join(__dirname, './path/File.yaml'));
  const admin = YAML.load(path.join(__dirname, './path/Admin.yaml'));
  const stack = YAML.load(path.join(__dirname, './path/Stack.yaml'));
  base.paths = {
    ...base.paths,
    ...about.paths,
    ...project.paths,
    ...partner.paths,
    ...contact.paths,
    ...service.paths,
    ...file.paths,
    ...admin.paths,
    ...stack.paths,
  };

  return base;
};

module.exports = mergeYAML;
