import { removeWebsite } from 'src/shared/enum/enum';

function websiteHandler(masterName) {
    return removeWebsite.indexOf(masterName) === -1;
}

export default websiteHandler;