import visualizations from './api/public/visualizations'
import auth from './api/auth'
import { ensureAuthenticated, ensureAccount } from './middleware/authentication'
const Visualization = require('./api/private/Visualizations')
const OipaMeta = require('./api/private/OipaMeta')
const IatiRegistryMeta = require('./api/private/IatiRegistryMeta')
const Publisher = require('./api/private/Publisher')
const Activities = require('./api/private/Activities')

const User = require('./api/private/User')
// import Visualization from "./api/private/Visualizations"
// import OipaMeta from "./api/private/OipaMeta"
// import User from "./api/private/User"

module.exports = function(app) {

    app.io.on('connection', function(socket) {

        socket.emit('connected', 'connected');
        const user = socket.request.user;

        console.log('binding socket events for user: ' + user.username);

        socket.on('User.updateUI', User.updateUI.bind(null, user));
        socket.on('User.updateProfile', User.updateProfile.bind(null, user));

        // bind API events here
        socket.on('Visualization.get', Visualization.get.bind(null, user));
        socket.on('Visualization.getAll', Visualization.getAll.bind(null, user));

        socket.on('Visualization.emptyTrash', Visualization.emptyTrash.bind(null, user));

        socket.on('Visualization.create', Visualization.create.bind(null, user));
        socket.on('Visualization.update', Visualization.update.bind(null, user));
        socket.on('Visualization.delete', Visualization.delete.bind(null, user));
        socket.on('Visualization.updateAndRefresh', Visualization.updateAndRefresh.bind(null, user));
        socket.on('Visualization.fork', Visualization.fork.bind(null, user));


        socket.on('Visualization.addItem', Visualization.addItem.bind(null, user));
        socket.on('Visualization.removeItem', Visualization.removeItem.bind(null, user));
        socket.on('Visualization.replaceItem', Visualization.replaceItem.bind(null, user));
        // socket.on('Visualization.changeItem', Visualization.changeItem.bind(null, user));

        socket.on('Visualization.addContext', Visualization.addContext.bind(null, user));
        socket.on('Visualization.replaceContext', Visualization.replaceContext.bind(null, user));
        socket.on('Visualization.removeContext', Visualization.removeContext.bind(null, user));

        socket.on('Visualization.adminToggleHide', Visualization.adminToggleHide.bind(null, user));

        socket.on('OipaMeta.getItemFilters', OipaMeta.getItemFilters.bind(null, user));
        socket.on('OipaMeta.getFilteredItemFilters', OipaMeta.getFilteredItemFilters.bind(null, user));
        socket.on('OipaMeta.getContextFilters', OipaMeta.getContextFilters.bind(null, user));
        socket.on('OipaMeta.getFilteredContextFilters', OipaMeta.getFilteredContextFilters.bind(null, user));

        socket.on('Publisher.get', Publisher.get.bind(null, user));
        socket.on('Publisher.delete', Publisher.delete.bind(null, user));
        // Checkbox for autoPublish option update
        socket.on('Publisher.update', Publisher.update.bind(null, user));
        // Generate XML file
        socket.on('Publisher.generateXmlFile', Publisher.generateXmlFile.bind(null, user));
        // Activities Defaults Form using Redux Form
        socket.on('Publisher.test', Publisher.test.bind(null, user));

        // Get API Validate API Key
        socket.on('IatiRegistryMeta.getApiKeyValidation', IatiRegistryMeta.getApiKeyValidation.bind(null, user));
        // Get API Unlink
        socket.on('IatiRegistryMeta.getApiKeyUnlink', IatiRegistryMeta.getApiKeyUnlink.bind(null, user));
        // Create Publish Dataset
        socket.on('IatiRegistryMeta.publishDataset', IatiRegistryMeta.publishDataset.bind(null, user));
        // Delete Dataset
        socket.on('IatiRegistryMeta.deleteDataset', IatiRegistryMeta.deleteDataset.bind(null, user));
        // Update Dataset
        socket.on('IatiRegistryMeta.updateDataset', IatiRegistryMeta.updateDataset.bind(null, user));
        // Add activity
        socket.on('Activities.publishActivity', Activities.publishActivity.bind(null, user));
    })
}
