class HAX {
	constructor(apikey, header=true) {
		this.apikey = apikey;
		this.unreadpms = -1;
		this.posts = {};
		this.threads = {};
		this.forums = {};
		this.users = {};
		this.groups = {};
	}
	
	
	getUser(uids, func, params={}) {
		var _this = this;
		var url;
		
		if(Array.isArray(uids)) {
			uids = uids.filter(function(value) {
				return Number.isInteger(value) ? true : false;
			});
			
			if(uids.length > 0) {
				url = 'https://hackforums.net/api/v1/users/' + uids.join();
			} else {
				func({
					success: false,
					message: "Invalid UIDS"
				});
				
				return;
			}
		} else {
			if(Number.isInteger(parseInt(uids))) {
				url = 'https://hackforums.net/api/v1/user/' + uids;
			} else {
				func({
					success: false,
					message: 'Invalid UID'
				});
				
				return;
			}
		}
		
		this.accessAPI(url, func, params);
	}
	
	
	getPost(pids, func, params={}) {
		var _this = this;
		var url;
		
		if(Array.isArray(pids)) {
			func({
				success: false,
				message: 'Array not supported'
			});
			
			return;
		} else {
			if(Number.isInteger(parseInt(pids))) {
				url = 'https://hackforums.net/api/v1/post/' + pids;
			} else {
				func({
					success: false,
					message: 'Invalid PID'
				});
				
				return;
			}
		}
		
		this.accessAPI(url, function(data) {
			if(data.success === true) {
				data.result.pid = pids;
				_this.posts[pids] = data.result;
			}
			func(data);
		}, params);
	}
	
	
	getCategory(fids, func, params={}) {
		var _this = this;
		var url;
		
		if(Array.isArray(fids)) {
			func({
				success: false,
				message: 'Array not supported'
			});
			
			return;
		} else {
			if(Number.isInteger(parseInt(fids))) {
				url = 'https://hackforums.net/api/v1/category/' + fids;
			} else {
				func({
					success: false,
					message: 'Invalid FID'
				});
				
				return;
			}
		}
		
		this.accessAPI(url, func, params);
	}
	
	
	getForum(fids, func, params={}) {
		var _this = this;
		var url;
		
		if(Array.isArray(fids)) {
			func({
				success: false,
				message: 'Array not supported'
			});
			
			return;
		} else {
			if(Number.isInteger(parseInt(fids))) {
				url = 'https://hackforums.net/api/v1/forum/' + fids;
			} else {
				func({
					success: false,
					message: 'Invalid FID'
				});
				
				return;
			}
		}
		
		this.accessAPI(url, func, params);
	}
	
	
	getThread(tids, func, params={}) {
		var _this = this;
		var url;

		if(Array.isArray(tids)) {
			func({
				success: false,
				message: 'Array not supported'
			});
			
			return;
		} else {
			if(Number.isInteger(parseInt(tids))) {
				url = 'https://hackforums.net/api/v1/thread/' + tids;
			} else {
				func({
					success: false,
					message: 'Invalid TID'
				});
				
				return;
			}
		}
		
		
		this.accessAPI(url, function(data) {
			if(data.success === true) {
				data.result.postdata.forEach(function(element) {
					element.fid = data.result.fid;
					element.tid = tids;
					_this.posts[element.pid] = element;
				});
			}
			func(data);
		}, params);
	}
	
	
	getPM(pmids, func, params={}) {
		var _this = this;
		var url;
		
		if(Array.isArray(pmids)) {
			func({
				success: false,
				message: 'Array not supported'
			});
			
			return;
		} else {
			if(Number.isInteger(parseInt(pmids))) {
				url = 'https://hackforums.net/api/v1/pm/' + pmids;
			} else {
				func({
					success: false,
					message: 'Invalid PMID'
				});
				
				return;
			}
		}
				
		this.accessAPI(url, func, params);
	}
	
	
	getPMBox(fids, func, params={}) {
		var _this = this;
		var url;
		
		if(Array.isArray(fids)) {
			func({
				success: false,
				message: 'Array not supported'
			});
			
			return;
		} else {			
			if(Number.isInteger(parseInt(fids))) {
				url = 'https://hackforums.net/api/v1/pmbox/' + fids;
			} else if(typeof fids == 'string') {
				switch(fids.toLowerCase()) {
					case 'sent':
						url = 'https://hackforums.net/api/v1/pmbox/2';
						break;
					case 'drafts':
						url = 'https://hackforums.net/api/v1/pmbox/3';
						break;
					case 'trash':
						url = 'https://hackforums.net/api/v1/pmbox/4';
						break;
					case 'inbox':
					default:
						url = 'https://hackforums.net/api/v1/pmbox/1';
						break;
				}
			} else {
				func({
					success: false,
					message: 'Invalid FID'
				});
				
				return;
			}
		}
		
		this.accessAPI(url, func, params);
	}
	
	
	getGroup(gids, func, params={}) {
		var _this = this;
		var url;
		
		if(Array.isArray(gids)) {
			func({
				success: false,
				message: 'Array not supported'
			});
			
			return;
		} else {
			if(Number.isInteger(parseInt(gids))) {
				url = 'https://hackforums.net/api/v1/group/' + gids;
			} else {
				func({
					success: false,
					message: 'Invalid GID'
				});
				
				return;
			}
		}
		
		this.accessAPI(url, func, params);
	}
	
	
	accessAPI(url, func, params={}) {
		var _this = this;
		var settings = {
			async: params.async == undefined ? true : params.async,
			raw: params.raw == undefined ? '' : 'raw&',
			page: params.page == undefined ? 'page=1&' : 'page=' + params.page + '&',
			header: params.header == undefined ? true : params.header
		}

		var checkPMs = settings.header == true ? 'include=header' : '';
		
		url += '?' + settings.raw + settings.page + checkPMs;
		
		$.ajax({
			type: 'GET',
			url: url,
			async: settings.async,
			dataType: 'json',
			username: this.apikey,
			password: '',
			success: function(data) {
				if(data.hasOwnProperty('header')) {
					_this.unreadpms = data.header.unreadpms;
				}
				func(data);
			}
		});
	}
}