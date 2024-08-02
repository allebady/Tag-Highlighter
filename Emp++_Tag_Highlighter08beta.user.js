// ==UserScript==
// @name Emp++ Tag Highlighter 0.8 (beta)
// @version 0.8.0.2
// @description highlights liked/disliked tags
// @grant GM_getValue
// @grant GM_setValue
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @include /^https://www\.empornium\.(me|sx|is)/
// @include /^https://www\.enthralled\.me/
// @include /^https://pornbay\.org/
// @include /^https://femdomcult\.org/
// @include /^https://www\.homeporntorrents\.club/
// @updateURL https://raw.githubusercontent.com/allebady/Tag-Highlighter/master/Emp%2B%2B_Tag_Highlighter08beta.user.js
// ==/UserScript==

// Changelog:
// Version 0.8.0 beta2
// - Removed Torrent Coloring and Torrent Opacity features due to issues with styles (sorry) Use Percent Bar instead
// - Added options to use group coloring in Percent bar (Percent Bar 2.0)
// Version 0.8.0 beta1
// Added UpdateURL to automate updates.
// Replaced male with MILF
// Add options to ignore blacklist in bookmarks and/or collages.
// minor fixes (forgot what they were)
// Version 0.7.6b
// - Fixed a bug in Blacklisted tags not triggering properly
// Version 0.7.6
// - A few improvements or changes that has been suggested.
// - Added checkbox for showing the blacklisted notice.
// - Removed the the feature of ignoring "." in tags for performance issues.
//      note this will remove the "big.tits also saves bigtits automatically" feature
// - Minor fixes
// Version 0.7.5e
// - Simplify website rules
// - Fix old http links (Torrent Display Options)
// - Add support for femdomcult.org
// - Add support for homeporntorrents.club
// Version 0.7.5d
// - Add support for enthralled.me
// Version 0.7.5c
// - Fixing some bugs that appear after the cleaning.
// Version 0.7.5b
// - Cleaning up
// Version 0.7.5
// - Added Import/Export feature.
// - Added [ESC] to close Tag Highlighter.
// - Fixed some spelling mistakes
// Version 0.7.3
// - Updated for better/more domain handling and added some updates suggested by SturmB:
// - - Adds better support for Pornbay. (Subdomains and Tag-Config link)
// - - Updates jQuery to latest stable version on the v1 track.
// Version 0.7.2
// - Corrected a wrong placement of a 'amateur' instead of a 'loveamat'
// Version 0.7.1
// - Reorganized settings page to accommodate low resolution monitors
// Version 0.7.0
// - Added more tag-groups
// - Color change to accommodate more tag-groups
// - Added option to hide tag buttons
// - Few renames and corrections of variables
// - Few size changes to fit all text
// Version 0.6.2
// - Preparing for new "branch".
// - "Tag config" renamed "old tag config".
// Version 0.6.1
// - updated taglinks
// Version 0.6.0
// - Added more tag-groups
// - Removed autodownvote, it shouldn't be used anyway (it's still in the code if you need to deactivate it or notice problems)
// - Changed Useless tags to only be toggle-able on Disliked tags to save space. Let me know if you disagree with this decision
// - Loved Performers/tags can be toggled after you liked a perfomer/tag
// - few size changes to fit all in the config window

function runScript(){
	var $j = $.noConflict(true);

	var defaults = {
		majorVersion : 0.8,
	//Options
		truncateTags : true,
	//Browse Page Options
		usePercentBar : false,
		usePercentMoreColors : false,
		useTorrentBlacklistNotice : true,
		useBlacklistNoticeBookmark : false,
		useBlacklistNoticeCollages : false,
	//Tag types to use
		useGoodTags : false,
		useLovedTags : false,
		usePerformerTags : false,
		useLoveperfTags : false,
		useNewperfTags : false,
		useAmateurTags : false,
		useLoveamatTags : false,
		useMilfperfTags : false,
		useLovemilfTags : false,
		useLikesiteTags : false,
		useLovesiteTags : false,
		useDislikedTags : false,
		useHatedTags : false,
		useTerribleTags : false,
		useUselessTags : false,
	//Tag Button Options
		buttonGoodTags : false,
		buttonPerformerTags : false,
		buttonNewperfTags : false,
		buttonAmateurTags : false,
		buttonMilfperfTags : false,
		buttonLikesiteTags : false,
		buttonDislikedTags : false,
	};

	var settings = getSettings();

	settings = $j.extend(true, defaults, settings);

	if(settings.majorVersion < defaults.majorVersion){
		settings.majorVersion = defaults.majorVersion;
		saveSettings();
		//handle upgrade
	}

    //import tags from pre-v0.4 ETH
    if(!settings.tags){
        settings.tags = {
            good : getValue("good_tags", "").split(' '),
			loved : getValue("loved_tags", "").split(' '),
            performer : getValue("performer_tags", "").split(' '),
			loveperf : getValue("loveperf_tags", "").split(' '),
			newperf : getValue("newperf_tags", "").split(' '),
			amateur : getValue("amateur_tags", "").split(' '),
			loveamat : getValue("loveamat_tags", "").split(' '),
			milfperf : getValue("milfperf_tags", "").split(' '),
			lovemilf : getValue("lovemilf_tags", "").split(' '),
			likesite : getValue("likesite_tags", "").split(' '),
			lovesite : getValue("lovesite_tags", "").split(' '),
            disliked : getValue("bad_tags", "").split(' '),
            hated : getValue("hated_tags", "").split(' '),
            terrible : getValue("terrible_tags", "").split(' '),
            useless : getValue("useless_tags", "").split(' ')
        };
        saveSettings();
    }

	var configHTML =
		"<div id='s-conf-background'>" +
		"<div id='s-conf-wrapper'>" +
		"<h1>Empornium++Tag Highlighter Settings</h1>" +
		"<div id='s-conf-status'></div>" +

		// Tabs
		"<div class='tab-row-container'" +
		"<ul class='tab-row'>" +
		"<li data-page='s-conf-general' class='s-selected'><a class='s-conf-tab' >General</a></li>" +
		"<li data-page='s-conf-good-tags'><a class='s-conf-tab'>Liked Tags</a></li>" +
		"<li data-page='s-conf-loved-tags'><a class='s-conf-tab'>Loved Tags</a></li>" +
		"<li data-page='s-conf-performer-tags'><a class='s-conf-tab'>Performer Tags</a></li>" +
		"<li data-page='s-conf-loveperf-tags'><a class='s-conf-tab'>Loved Performer Tags</a></li>" +
		"<li data-page='s-conf-newperf-tags'><a class='s-conf-tab'>New Performer Tags</a></li>" +
		"<li data-page='s-conf-amateur-tags'><a class='s-conf-tab'>Amateur Tags</a></li>" +
		"<li data-page='s-conf-loveamat-tags'><a class='s-conf-tab'>Loved Amateur Tags</a></li>" +
		"<li data-page='s-conf-milfperf-tags'><a class='s-conf-tab'>Milf Performer Tags</a></li>" +
		"</ul>" +
		"</div>"+
		"<div class='tab-row-container'" +
		"<ul class='tab-row'>" +
		"<li data-page='s-conf-lovemilf-tags'><a class='s-conf-tab'>Loved Milf Performer Tags</a></li>" +
		"<li data-page='s-conf-likesite-tags'><a class='s-conf-tab'>Liked Site Tags</a></li>" +
		"<li data-page='s-conf-lovesite-tags'><a class='s-conf-tab'>Loved Site Tags</a></li>" +
		"<li data-page='s-conf-disliked-tags'><a class='s-conf-tab'>Disliked Tags</a></li>" +
		"<li data-page='s-conf-hated-tags'><a class='s-conf-tab'>Hated Tags</a></li>" +
		"<li data-page='s-conf-terrible-tags'><a class='s-conf-tab'>Blacklisted Tags</a></li>" +
		"<li data-page='s-conf-useless-tags'><a class='s-conf-tab'>Useless Tags</a></li>" +
		"<li data-page='s-conf-import-export'><a class='s-conf-tab'>Import/Export</a></li>" +
		"<li><a class='s-conf-tab' data-page=''></a></li>" +
		"</ul>" +
		"</div>"+
		// End Tabs
		"<div id='s-conf-content'>" +
		"<form id='s-conf-form'>" +
		"<div class='s-conf-page s-selected' id='s-conf-general'>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='truncateTags'/> Automatically truncate long tags on torrent details page</label>" +
		"<br/><h2>Enable/Disable Tag Types:</h2>" +
		"<label><span><input class='s-conf-gen-checkbox' type='checkbox' name='useGoodTags'/> Use Liked Tag Type</span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span style='text-align=center'><input class='s-conf-gen-checkbox' type='checkbox' name='buttonGoodTags'/> Hide Liked Tag Button</span></label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useLovedTags'/> Use Loved Tag Type (Require Liked Tag active)</label>" +
		"<label><span><input class='s-conf-gen-checkbox' type='checkbox' name='usePerformerTags'/> Use Performer Tag Type</span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='buttonPerformerTags'/> Hide Performer Tag Button</span></label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useLoveperfTags'/> Use Loved Performer Tag Type (Require Performer)</label>" +
		"<label><span><input class='s-conf-gen-checkbox' type='checkbox' name='useNewperfTags'/> Use New Performer Tag Type </span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='buttonNewperfTags'/> Hide New Performer Tag Button</label>" +
		"<label><span><input class='s-conf-gen-checkbox' type='checkbox' name='useAmateurTags'/> Use Amateur Tag Type</span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='buttonAmateurTags'/> Hide Amateur Tag Button</span></label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useLoveamatTags'/> Use Loved Amateur Tag Type (Require Amateur)</label>" +
		"<label><span><input class='s-conf-gen-checkbox' type='checkbox' name='useMilfperfTags'/> Use Milf Performer Tag Type</span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='buttonMilfperfTags'/> Hide Milf Performer Tag Button</span></label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useLovemilfTags'/> Use Loved Milf Performer Tag Type (Require Milf Performer)</label>" +
		"<label><span><input class='s-conf-gen-checkbox' type='checkbox' name='useLikesiteTags'/> Use Liked Site Tag Type</span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='buttonLikesiteTags'/> Hide Liked Site Tag Button</span></label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useLovesiteTags'/> Use Loved Site Tag Type (Require Liked Site)</label>" +
		"<label><span><input class='s-conf-gen-checkbox' type='checkbox' name='useDislikedTags'/> Use Disliked Tag Type</span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='buttonDislikedTags'/> Hide Disliked Tag Button</span></label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useHatedTags'/> Use Hated Tag Type. (Requires Disliked)</label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useTerribleTags'/> Use Blacklisted Tag Type. May not work properly with collapsed duplicates user script (Requires Disliked)</label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useUselessTags'/> Use Useless Tag Type (Requires Disliked)</label>" +
		"<br/><h2>Torrent Display Options:</h2>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='usePercentBar'/> Use Percent Bar <a>(View Example)</a>" +
		"<img src='https://jerking.empornium.ph/images/2024/07/23/2U1Ei.png'/></label>" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='usePercentMoreColors'/> Keep tag group colors instead of just good/bad" +
		"<label><input class='s-conf-gen-checkbox' type='checkbox' name='useTorrentBlacklistNotice'/> Show Blacklisted Notices</span><span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='useBlacklistNoticeBookmark'/> Ignore blacklist on Bookmarks Page</span> <span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 </span><span><input class='s-conf-gen-checkbox' type='checkbox' name='useBlacklistNoticeCollages'/> Ignore blacklist on Collages Page</span> <span></label>" +		
		"<div class='s-conf-buttons'>" +
		"<input id='s-conf-save' type='button' value='Save Settings'/>" +
		"</div>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-good-tags'>" +
		"<label title='Space-separated. '>Add Liked Tags:<br/>" +
		"<input id='s-conf-add-good' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='good' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Liked Tags:<br/>" +
		"<input id='s-conf-remove-good' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='good' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Liked Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-good' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-loved-tags'>" +
		"<label title='Space-separated. '>Add Loved Tags:<br/>" +
		"<input id='s-conf-add-loved' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='loved' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Loved Tags:<br/>" +
		"<input id='s-conf-remove-loved' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='loved' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Loved Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-loved' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-performer-tags'>" +
		"<label title='Space-separated. '>Add Performer Tags:<br/>" +
		"<input id='s-conf-add-performer' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='performer' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Performer Tags:<br/>" +
		"<input id='s-conf-remove-performer' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='performer' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Performer Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-performer' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-loveperf-tags'>" +
		"<label title='Space-separated. '>Add Loved Performer Tags:<br/>" +
		"<input id='s-conf-add-loveperf' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='loveperf' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Performer Tags:<br/>" +
		"<input id='s-conf-remove-loveperf' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='loveperf' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Loved Performer Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-loveperf' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-newperf-tags'>" +
		"<label title='Space-separated. '>Add New Performers Tags:<br/>" +
		"<input id='s-conf-add-newperf' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='newperf' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove New Performers Tags:<br/>" +
		"<input id='s-conf-remove-newperf' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='newperf' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>New Performer Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-newperf' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-amateur-tags'>" +
		"<label title='Space-separated. '>Add Amateur Tags:<br/>" +
		"<input id='s-conf-add-amateur' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='amateur' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Amateur Tags:<br/>" +
		"<input id='s-conf-remove-amateur' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='amateur' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Amateur Tags - If enabled, these tags will be highlighted :</h2>" +
		"<textarea readonly id='s-conf-text-amateur' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-loveamat-tags'>" +
		"<label title='Space-separated. '>Add Loved Amateur Tags:<br/>" +
		"<input id='s-conf-add-loveamat' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='loveamat' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Amateur Tags:<br/>" +
		"<input id='s-conf-remove-loveamat' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='loveamat' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Loved Amateur Tags - If enabled, these tags will be highlighted :</h2>" +
		"<textarea readonly id='s-conf-text-loveamat' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-milfperf-tags'>" +
		"<label title='Space-separated. '>Add Milf Performers Tags:<br/>" +
		"<input id='s-conf-add-milfperf' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='milfperf' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Milf Performers Tags:<br/>" +
		"<input id='s-conf-remove-milfperf' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='milfperf' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Milf Performer Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-milfperf' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-lovemilf-tags'>" +
		"<label title='Space-separated. '>Add Loved Milf Performers Tags:<br/>" +
		"<input id='s-conf-add-lovemilf' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='lovemilf' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Loved Milf Performers Tags:<br/>" +
		"<input id='s-conf-remove-lovemilf' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='lovemilf' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Loved Milf Performer Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-lovemilf' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-likesite-tags'>" +
		"<label title='Space-separated. '>Add Liked Site Tags:<br/>" +
		"<input id='s-conf-add-likesite' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='likesite' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Liked Site Tags:<br/>" +
		"<input id='s-conf-remove-likesite' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='likesite' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Liked Site Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-likesite' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-lovesite-tags'>" +
		"<label title='Space-separated. '>Add Loved Site Tags:<br/>" +
		"<input id='s-conf-add-lovesite' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='lovesite' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Loved Site Tags:<br/>" +
		"<input id='s-conf-remove-lovesite' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='lovesite' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Loved Site Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-lovesite' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-disliked-tags'>" +
		"<label title='Space-separated. '>Add Disliked Tags:<br/>" +
		"<input id='s-conf-add-disliked' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='disliked' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Disliked Tags:<br/>" +
		"<input id='s-conf-remove-disliked' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='disliked' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Disliked Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-disliked' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-hated-tags'>" +
		"<label title='Space-separated. '>Add Hated Tags:<br/>" +
		"<input id='s-conf-add-hated' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='hated' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove HatedTags:<br/>" +
		"<input id='s-conf-remove-hated' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='hated' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Hated Tags - If enabled, these tags will be highlighted:</h2>" +
		"<textarea readonly id='s-conf-text-hated' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-terrible-tags'>" +
		"<label title='Space-separated. '>Add Blacklisted Tags:<br/>" +
		"<input id='s-conf-add-terrible' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='terrible' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Blacklisted Tags:<br/>" +
		"<input id='s-conf-remove-terrible' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='terrible' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Blacklisted Tags - If enabled, torrents with these tags will be hidden:</h2>" +
		"<textarea readonly id='s-conf-text-terrible' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		"<div class='s-conf-page' id='s-conf-useless-tags'>" +
		"<label title='Space-separated. '>Add Useless Tags:<br/>" +
		"<input id='s-conf-add-useless' class='s-conf-add-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-add-btn' data-type='useless' value='Add Tags' type='button'/>" +
		"</label><br/>" +
		"<label title='Space-separated. '>Remove Useless Tags:<br/>" +
		"<input id='s-conf-remove-useless' class='s-conf-remove-tags' type='text' placeholder='Space-separated. '/>" +
		"<input class='s-conf-remove-btn' data-type='useless' value='Remove Tags' type='button'/>" +
		"</label><br/>" +
		"<label><h2>Useless Tags - If enabled, these tags will be hidden:</h2>" +
		"<textarea readonly id='s-conf-text-useless' class='s-conf-tag-txtarea'></textarea></label>" +
		"</div>" +
		// Import/Export panel
		"<div class='s-conf-page' id='s-conf-import-export'>" +
		"<h3>Export Settings</h3>" +
		"<hr>" +
		"<p>To backup your settings, copy below text to a local file. You can import these settings in the Import Settings area.</p>" +
		"<textarea id='export-settings-textarea' rows='10' cols='100' readonly></textarea><br><br>" +
		"<br>" +
		"<h3>Import Settings</h3>" +
		"<hr><br>" +
		"<textarea id='import-settings-textarea' rows='10' cols='100' placeholder='Paste your exported settings here.'></textarea><br><br>" +
		"<button id='import-settings-button'>Import Settings</button>" +
		"</div>" +
		// End Import/Export
		"</form>" +
		"</div>" +
		"<div class='s-conf-buttons'>" +
		"<input id='s-conf-close' type='button' value='Close'/>" +
		"</div>" +
		"</div>" +
		"</div>";


	var stylesheet = "<style type='text/css'>" +
		//DEFAULT STYLE OVERRIDES
		"#torrent_tags>li{border-bottom:1px solid #999; padding-bottom:2px;}" +
		//CONFIGURATION STYLES
		"#s-conf-background{position:fixed; top:0; bottom:0; left:0; right:0; z-index:1000; background-color:rgba(50,50,50,0.6);}" +
		"#s-conf-wrapper{background:#eee; color:#444; position:relative; width:1200px; overflow:hidden; margin:50px auto; font-size:14px;" +
		"padding:15px 20px; border-radius:16px; box-shadow: 0 0 20px black;}" +
		"#s-conf-wrapper h2{background:none; text-align:left; color:#444; padding:0; border-radius: unset;}" +
		"#s-conf-status{padding:8px; line-height:16px; text-align:center; border:1px solid #ddd; margin-top:15px; display:none;}" +
		"#s-conf-status.s-success{border-color:#135300; background:#A9DF9C;}" +
		"#s-conf-status.s-error{border-color:#840000; background:#F3AAAA;}" +
		"#s-conf-status-close{cursor:pointer;}" +
		"#s-conf-tabs{width:100%; margin:15px 0 -1px 0; overflow:hidden; cursor:pointer;}" +
		"#s-conf-tabs li, #s-conf-tabs h2{ border: 1px solid #444; border-bottom: 0; border-radius: 4px 4px 0 0; line-height: normal; width: 130px; margin:0; list-style:none;float:left;}" +
		"#s-conf-content{width:100%; overflow:hidden; border:1px solid #444; border-radius:4px; border-top-left-radius: 0px; box-shadow:0 -1px 10px rgba(0,0,0,0.6);}" +
		".tab-row-container {height: 50px;box-sizing: border-box;  display: flex;cursor:pointer;}" +
		".tab-row-container li {display:inline-block;height: 40px;flex: 1; list-style: none; margin: 0; border: 1px solid #444; border-bottom: 0; border-radius: 4px 4px 0 0; line-height: normal; text-align: center;padding:5px;}" +
		".tab-row-container a {color: #444; font-size:14px;text-align: center; text-decoration:none;}" +
		".tab-row-container a:hover { text-decoration:none; color: black;}" +
		".tab-row-container li:hover {background-color: white;}" +
		".tab-row-container li.s-selected {background-color:#fff;text-decoration:none; color:black}" +
		"#s-conf-form{display:block; background:#fff; padding:15px;}" +
		"#s-conf-form label{display:block;}" +
		".s-conf-buttons{margin-top:8px; width:100%; text-align:center;}" +
		".s-conf-page{display:none;}" +
		".s-conf-page.s-selected{display:block;}" +
		".s-conf-page input{vertical-align:text-bottom;}" +
		"#s-conf-general label{cursor:pointer;}" +
		"#s-conf-general img{margin-bottom:10px; display:none;}" +
		"#s-conf-general a:hover+img{display:block;}" +
		".s-conf-tag-txtarea{width:1100px; height:300px; background:#ddd; word-spacing:10px; line-height:18px;}" +
		".s-conf-add-tags, .s-conf-remove-tags{width:950px;}" +
		".s-conf-add-btn, .s-conf-remove-btn{width:110px;}" +
		//GENERAL STYLES
		"span.s-tag.s-good{float:none; background:#A9DF9C; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-good> a{color:#000000}" +
		"span.s-tag.s-loved{float:none; background:#3D9949; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-loved> a{color:#000000}" +
		"span.s-tag.s-performer{float:none; background:#769dc9; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-performer> a{color:#000000}" +
		"span.s-tag.s-loveperf{float:none; background:#1c54d4; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-loveperf> a{color:#ffffff}" +
		"span.s-tag.s-newperf{float:none; background:#f7d600; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-newperf> a{color:#000000}" +
		"span.s-tag.s-amateur{float:none; background:#00f7ea; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-amateur> a{color:#000000}" +
		"span.s-tag.s-loveamat{float:none; background:#00aba2; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-loveamat> a{color:#ffffff}" +
		"span.s-tag.s-milfperf{float:none; background:#e86eed; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-milfperf> a{color:#000000}" +
		"span.s-tag.s-lovemilf{float:none; background:#d01dd7; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-lovemilf> a{color:#ffffff}" +
		"span.s-tag.s-likesite{float:none; background:#f3af58; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-likesite> a{color:#000000}" +
		"span.s-tag.s-lovesite{float:none; background:#e58306; border-bottom:1px solid #135300; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-lovesite> a{color:#ffffff}" +
		"span.s-tag.s-disliked{float:none;background:#F3AAAA; border-bottom:1px solid #840000; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-disliked> a{color:#000000}" +
		"span.s-tag.s-hated{float:none;background:#840000; border-bottom:1px solid #840000; padding:0px 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-hated> a{color:#ffffff}" +
		"span.s-tag.s-terrible{float:none; background:#222; border-bottom:1px solid #888; padding:0x 4px; border-radius:16px; font:bold;}" +
		"span.s-tag.s-terrible> a{color:#EEE}" +
		"span.s-tag.s-useless{float:none; background:#AAA; border-bottom:1px solid #444; padding:0px 4px; border-radius:16px; display:none;}" +
		"#s-toggle-forum{margin:0 5px; font-size:0.9em; cursor:pointer;}" +
		"span.s-tag.s-useless> a{color:#000000}" +
		//BROWSE PAGE STYLES
		".s-browse-tag-holder{padding: 0px 0px 0px 0px; float:none;}" +
		".s-browse-tag-holder>.s-tag{display:inline; float:none;}" +
		".s-terrible-hidden{cursor: pointer; padding:10px;}" +
		".s-percent-container{height:4px; margin:2px 0; overflow:hidden; background:#ccc; border:1px solid #aaa;}" +
		".s-percent{height:4px;}" +
		".s-percent-good{background:#A9DF9C; float:left;}" +
		".s-percent-loved{background:#3D9949; float:left;}" +
		".s-percent-liked{background:#A9DF9C; float:left;}" +
		".s-percent-performer{background:#769dc9; float:left;}" +
		".s-percent-loveperf{background:#1c54d4; float:left;}" +
		".s-percent-newperf{background:#f7d600; float:left;}" +
		".s-percent-amateur{background:#00aba2; float:left;}" +
		".s-percent-loveamat{background:#00f7ea; float:left;}" +
		".s-percent-milfperf{background:#e86eed; float:left;}" +
		".s-percent-lovemilf{background:#d01dd7; float:left;}" +
		".s-percent-likesite{background:#f3af58; float:left;}" +
		".s-percent-lovesite{background:#e58306; float:left;}" +	
		".s-percent-bad{background:#9E3333; float:right}" +
		".s-percent-disliked{background:#9E3333; float:right}" +
		".s-percent-terrible{background:#333; float:right}" +

		//DETAILS PAGE STYLES
		".tag_inner .s-tag{background:#CCC; border-bottom:1px solid #888; border-radius:16px; padding:1px 5px;}" +
		".tag_inner .s-tag> a{color:#000000}" +
		".tag_inner span.s-tag {border-width: 2px; display:block; float:left; line-height: 18px; margin: 2px 3px; padding: 0 6px; white-space: nowrap;}" +
		".s-button{float:left; width:15px; height:14px; border-radius:6px; color:#fff; " +
		"font:bold 16px/15px Arial, sans-serif; text-align:center; margin:1px 3px 1px 0px; cursor:pointer; opacity:0.8;}" +
		".s-button:hover{opacity:1;}" +
		".s-remove-good, .s-remove-performer, .s-remove-loveperf, .s-remove-milfperf, .s-remove-lovemilf, .s-remove-disliked, .s-remove-hated, .s-remove-terrible, .s-remove-useless, .s-add-useless{line-height:11px;}" +
		".s-add-good, .s-remove-good{background:#A9DF9C; border:1px solid #135300;}" +
		".s-add-loved, .s-remove-loved{background:#3D9949; border:1px solid #135300;}" +
		".s-add-performer, .s-remove-performer{background:#769dc9; border:1px solid #135300;}" +
		".s-add-loveperf, .s-remove-loveperf{background:#1c54d4; border:1px solid #135300;}" +
		".s-add-newperf, .s-remove-newperf{background:#f7d600; border:1px solid #135300;}" +
		".s-add-amateur, .s-remove-amateur{background:#00aba2; border:1px solid #135300;}" +
		".s-add-loveamat, .s-remove-loveamat{background:#00f7ea; border:1px solid #135300;}" +
		".s-add-milfperf, .s-remove-milfperf{background:#e86eed; border:1px solid #135300;}" +
		".s-add-lovemilf, .s-remove-lovemilf{background:#d01dd7; border:1px solid #135300;}" +
		".s-add-likesite, .s-remove-likesite{background:#f3af58; border:1px solid #135300;}" +
		".s-add-lovesite, .s-remove-lovesite{background:#e58306; border:1px solid #135300;}" +
		".s-add-disliked, .s-remove-disliked{background:#9E3333; border:1px solid #840000;}" +
		".s-add-hated, .s-remove-hated{background:#9E3333; border:1px solid #840000;}" +
		".s-add-terrible, .s-remove-terrible{background:#333; border:1px solid #000;}" +
		".s-add-useless, .s-remove-useless{background:#888; border:1px solid #444;}" +
		".s-tag{margin:1px 2px;}" +
		".s-tag .s-button{display:none;}" +
		".s-tag .s-add-good, .s-tag .s-add-performer, .s-tag .s-add-newperf, .s-tag .s-add-amateur, .s-tag .s-add-milfperf, .s-tag .s-add-likesite, .s-tag .s-add-disliked{display:block}" +
		".s-tag.s-good .s-button, .s-tag.s-loved .s-button, .s-tag.s-performer .s-button, .s-tag.s-loveperf .s-button, .s-tag.s-newperf .s-button, .s-tag.s-amateur .s-button, .s-tag.s-loveamat .s-button, .s-tag.s-milfperf .s-button, .s-tag.s-lovemilf .s-button, .s-tag.s-likesite .s-button, .s-tag.s-lovesite .s-button, .s-tag.s-disliked .s-button, .s-tag.s-hated .s-button, .s-tag.s-terrible .s-button{display:none}" +
		".s-tag.s-good .s-button.s-remove-good, .s-tag.s-loved .s-button.s-remove-loved, .s-tag.s-performer .s-button.s-remove-performer, .s-tag.s-loveperf .s-button.s-remove-loveperf, .s-tag.s-newperf .s-button.s-remove-newperf, .s-tag.s-amateur .s-button.s-remove-amateur, .s-tag.s-loveamat .s-button.s-remove-loveamat, .s-tag.s-milfperf .s-button.s-remove-milfperf, .s-tag.s-lovemilf .s-button.s-remove-lovemilf, .s-tag.s-likesite .s-button.s-remove-likesite, .s-tag.s-lovesite .s-button.s-remove-lovesite, .s-tag.s-disliked .s-button.s-remove-disliked, .s-tag.s-hated .s-button.s-remove-hated, .s-tag.s-terrible .s-button.s-remove-terrible, " +
		".s-tag.s-good .s-button.s-add-loved, .s-tag.s-performer .s-button.s-add-loveperf, .s-tag.s-amateur .s-button.s-add-loveamat, .s-tag.s-milfperf .s-button.s-add-lovemilf, .s-tag.s-likesite .s-button.s-add-lovesite, .s-tag.s-disliked .s-button.s-add-hated, .s-tag.s-useless .s-button.s-remove-useless{display:block}" +
		".s-tag.s-disliked .s-button.s-add-terrible{display:block}" +
		".s-tag.s-disliked .s-button.s-add-useless{display:block}" +
	(settings.truncateTags ?
		 (".s-tag a{max-width:100px;overflow:hidden;text-overflow:ellipsis;}" +
		  ".s-tag.s-good a,.s-tag.s-performer a, .s-tag.s-useless a, .s-tag.s-terrible a{max-width:140px;}" +
		  ".s-tag.s-disliked a {max-width:120px;}" +
		  ".s-tag.s-staff a{max-width:64px;}" +
		  ".s-tag.s-good.s-staff a,.s-tag.s-performer.s-staff a, .s-tag.s-useless.s-staff a, .s-tag.s-terrible.s-staff a{max-width:104px;}" +
		  ".s-tag.s-staff.s-disliked a{max-width:84px;}")
		 : "") +
		".s-useless-tags{display:none;}" +
		".s-useless-toggle{font-weight:bold; cursor:pointer;}" +
		".s-useless-desc{clear:both; padding:8px 0 8px 15px;}" +
		"</style>";
		let userInfoID = "#nav_userinfo"; // The selector that Empornium uses
		if ($j(userInfoID).length < 1) {
		userInfoID = "#nav_useredit"; // // The selector that Pornbay uses
	}
	(function init() {
		// add stylesheet
		$j(stylesheet).appendTo("head");
		var test = $j('#torrent_table tbody tr.torrent.rowb').css('background-color');
		$j('#torrent_table').css('background-color',test);

		// add config link
		 $j("<li class='brackets' title=\"Change Empornium++Tag Highlighter's settings.\"><a href='#'>Tag-Config (beta)</a></li>").insertAfter(userInfoID).on("click", function(e){			e.preventDefault();
			initConfig($j(configHTML).prependTo("body"));
		});

		if(/torrents\.php/.test(window.location.href)){
			// torrent details
			if(/\bid\=/.test(window.location.href)){
				processDetailsPage();
			}
			// torrents overview
			else{
				processBrowsePage(".torrent", "torrent");
			}
		}
		// collage details/overview
		else if(/collage/.test(window.location.href)){
			processBrowsePage(".rowa, .rowb", "collage");
		}
		// subscribed collages with new additions
		else if(/userhistory\.php(.+)\bsubscribed_collages/.test(window.location.href)){
			processBrowsePage(".torrent", "torrent");
		}
		// user details
		else if(/user\.php(.+)\bid\=/.test(window.location.href)){
			processBrowsePage(".torrent", "torrent");
		}
		// top 10
		else if(/top10\.php/.test(window.location.href)){
			processBrowsePage(".torrent", "torrent");
		}
		else if(/bookmarks\.php/.test(window.location.href)){
			processBrowsePage(".rowa, .rowb", "request");
		}
		else if(/requests\.php/.test(window.location.href)){
			if(/\bid\=/.test(window.location.href)){
				processDetailsPage();
			}
			else{
				processBrowsePage(".rowa, .rowb", "request");
			}
		}
	}());

	function processBrowsePage(rowSelector, type){
		var rows = $j(rowSelector);

		rows.each(function(i, row){
			row = $j(row);
			var tagContainer = row.find(".tags").addClass("s-browse-tag-holder").css({
				"line-height" : "18px"
			}),
				totalTagNum = tagContainer.find("a").length,
				goodNum = 0, badNum = 0, terribleNum = 0, uselessNum = 0, lovedNum = 0, performerNum = 0, loveperfNum = 0, newperfNum = 0, amateurNum = 0,  loveamatNum = 0, milfperfNum = 0,  lovemilfNum = 0, likesiteNum = 0, lovesiteNum = 0, hatedNum = 0, likedNum = 0, dislikedNum = 0;

			if(!totalTagNum){
				return;
			}
			tagContainer.find("a").each(function(i, tagLink){
				tagLink = $j(tagLink);
				var tag = tagLink.text();

				tagLink = tagLink.wrap("<span>").parent().addClass("s-tag");
				tag = tag.toLowerCase();

				if(settings.useTerribleTags && isTag(settings.tags.terrible, tag)){
								
					
					
					if(window.location.href.indexOf("bookmarks")!=-1 && settings.useBlacklistNoticeBookmark ){
					}
					
										
					else if(window.location.href.indexOf("collage")!=-1 && settings.useBlacklistNoticeCollages  ) {
					}

					else if(!terribleNum){	
						var colspan = row.children().length;
						row.hide();
                        if ( settings.useTorrentBlacklistNotice ) {
                            $j("<tr class='tr11'></tr>").insertAfter(row).html(
                                "<td colspan='" + colspan + "' class='s-terrible-hidden'>" + capitaliseFirstLetter(type) +
                                " hidden because of the blacklisted tag: <strong>" + tag +
                                "</strong>. Click here to display the " + type + " listing.</td>").
                            on("click", function(){
                                $j(this).hide();
                                row.show();
                            });
                        } // if
                    } // if
					terribleNum++;
					badNum++;
					hatedNum++;
					tagLink.addClass("s-terrible s-disliked");
				}

				else if(settings.useLovedTags && isTag(settings.tags.loved, tag)){
					goodNum++;
					lovedNum++;
					tagLink.addClass("s-loved");
				}

				else if(settings.useGoodTags && isTag(settings.tags.good, tag)){
					goodNum++;
					likedNum++;
					tagLink.addClass("s-good");
				}
				else if(settings.useLoveperfTags && isTag(settings.tags.loveperf, tag)){
					goodNum++;
					loveperfNum++;
					tagLink.addClass("s-loveperf");
				}
				else if(settings.usePerformerTags && isTag(settings.tags.performer, tag)){
					goodNum++;
					performerNum++;
					tagLink.addClass("s-performer");
				}
				else if(settings.useNewperfTags && isTag(settings.tags.newperf, tag)){
					goodNum++;
					newperfNum++;
					tagLink.addClass("s-newperf");
				}
				else if(settings.useLoveamatTags && isTag(settings.tags.loveamat, tag)){
					goodNum++;
					loveamatNum++;
					tagLink.addClass("s-loveamat");
				}
				else if(settings.useAmateurTags && isTag(settings.tags.amateur, tag)){
					goodNum++;
					amateurNum++;
					tagLink.addClass("s-amateur");
				}
				else if(settings.useLovemilfTags && isTag(settings.tags.lovemilf, tag)){
					goodNum++;
					lovemilfNum++;
					tagLink.addClass("s-lovemilf");
				}
				else if(settings.useMilfperfTags && isTag(settings.tags.milfperf, tag)){
					goodNum++;
					milfperfNum++;
					tagLink.addClass("s-milfperf");
				}
				else if(settings.useLovesiteTags && isTag(settings.tags.lovesite, tag)){
					goodNum++;
					lovesiteNum++;
					tagLink.addClass("s-lovesite");
				}
				else if(settings.useLikesiteTags && isTag(settings.tags.likesite, tag)){
					goodNum++;
					likesiteNum++;
					tagLink.addClass("s-likesite");
				}
				else if(settings.useHatedTags && isTag(settings.tags.hated, tag)){
					badNum++;
					hatedNum++;
					tagLink.addClass("s-hated");
				}
				else if(settings.useUselessTags && isTag(settings.tags.useless, tag)){
					totalTagNum--;
					tagLink.addClass("s-useless");
				}
				else if(settings.useDislikedTags && isTag(settings.tags.disliked, tag)){
					badNum++;
					dislikedNum++;
					tagLink.addClass("s-disliked");
				}


			});
			var goodPercent = Math.round(goodNum/totalTagNum * 100);
			var badPercent = Math.round(badNum/totalTagNum * 100);

			var likedPercent = Math.round(likedNum/totalTagNum * 100);
			var dislikedPercent = Math.round(dislikedNum/totalTagNum * 100);			
			var lovedPercent = Math.round(lovedNum/totalTagNum * 100);
			var performerPercent = Math.round(performerNum/totalTagNum * 100);
			var loveperfPercent = Math.round(loveperfNum/totalTagNum * 100);
			var newperfPercent = Math.round(newperfNum/totalTagNum * 100);
			var amateurPercent = Math.round(amateurNum/totalTagNum * 100); 
			var loveamatPercent = Math.round(loveamatNum/totalTagNum * 100);
			var milfperfPercent = Math.round(milfperfNum/totalTagNum * 100); 
			var lovemilfPercent = Math.round(lovemilfNum/totalTagNum * 100);
			var likesitePercent = Math.round(likesiteNum/totalTagNum * 100);
			var lovesitePercent = Math.round(lovesiteNum/totalTagNum * 100);
			var dislikedPercent = Math.round(dislikedNum/totalTagNum * 100);
			var hatedPercent = Math.round(hatedNum/totalTagNum * 100);



			if(settings.usePercentBar&& !settings.usePercentMoreColors){
				var percentContainer = $j("<div class='s-percent-container'></div>)").insertBefore(tagContainer);
				percentContainer.width(tagContainer.parent().width() - 2);
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-good").width(goodPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-bad").width(badPercent + "%");
			}
			if(settings.usePercentMoreColors && settings.usePercentBar){
				var percentContainer = $j("<div class='s-percent-container'></div>)").insertBefore(tagContainer);
				percentContainer.width(tagContainer.parent().width() - 2);
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-liked").width(likedPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-loved").width(lovedPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-performer").width(performerPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-loveperf").width(loveperfPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-newperf").width(newperfPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-amateur").width(amateurPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-loveamat").width(loveamatPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-milfperf").width(milfperfPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-lovemilf").width(lovemilfPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-likesite").width(likesitePercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-lovesite").width(lovesitePercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-disliked").width(dislikedPercent + "%");
				$j("<div></div>").appendTo(percentContainer).addClass("s-percent s-percent-terrible").width(hatedPercent + "%");
			}
		});
	}

	function processDetailsPage(){
		var isTagsLoaded = false;

		var handleTagListLoad = function(){
			isTagsLoaded = false;
			var checkTagList = function(){
				if($j("#torrent_tags li a").hasClass("tags-loaded")){
					setTimeout(checkTagList, 30);
				}
				else{
					highlightDetailTags();
				}
			};
			checkTagList();
		};

		$j(".tag_header span a, #form_addtag input[type='button']").on("click", handleTagListLoad);
		$j("#tagname").on("keydown", function(e){
			if(e.keyCode === 13){
				handleTagListLoad();
			}
		});

		var highlightDetailTags = function(){
			if(isTagsLoaded) return;
			//Timeout to ensure we run after everything else
			var tagLinks = $j("#torrent_tags").find("a[href*='\\?taglist=']");

			isTagsLoaded = tagLinks.length > 0;

			if(!isTagsLoaded){
				setTimeout(highlightDetailTags, 200);
				return;
			}

			$j("<ul class='s-useless-tags nobullet'></ul>").appendTo("#torrent_tags").on("spyder.change", function(){
				var hiddenTagHolder = $j(this),
					hiddenTags = hiddenTagHolder.find("span.s-tag");

				if(hiddenTags.length){
					$j(".s-useless-msg").text("There's " + hiddenTags.length + " useless tag" + (hiddenTags.length > 1 ? "s" : "") + " on this torrent ");
					$j(".s-useless-msg, .s-useless-toggle").show();
				}
				else{
					$j(".s-useless-msg, .s-useless-toggle").hide();
				}
			}).before("<div class='s-useless-desc'><span class='s-useless-msg'></span> <a class='s-useless-toggle'>SHOW</a></div>");

			$j(".s-useless-toggle").on("click", function(){
				$j(".s-useless-tags").slideToggle("fast", function(){
					if($j(this).is(":visible")){
						$j(".s-useless-toggle").text("HIDE");
					}
					else{
						$j(".s-useless-toggle").text("SHOW");
					}
				});
			});

			tagLinks.each(function(i, tagLink){
				tagLink = $j(tagLink).addClass("tags-loaded");
				var tag = tagLink.text(),
					tagHolder = tagLink.wrap("<span>").parent().addClass("s-tag");

				tag = tag.toLowerCase();

				if(settings.useLovedTags && isTag(settings.tags.loved, tag)){
					tagHolder.addClass("s-loved");
				}
				else if(settings.useGoodTags && isTag(settings.tags.good, tag)){
					tagHolder.addClass("s-good");
				}
				else if(settings.useLoveperfTags && isTag(settings.tags.loveperf, tag)){
					tagHolder.addClass("s-loveperf");
				}
				else if(settings.usePerformerTags && isTag(settings.tags.performer, tag)){
					tagHolder.addClass("s-performer");
				}
				else if(settings.useNewperfTags && isTag(settings.tags.newperf, tag)){
					tagHolder.addClass("s-newperf");
				}
				else if(settings.useLoveamatTags && isTag(settings.tags.loveamat, tag)){
					tagHolder.addClass("s-loveamat");
				}
				else if(settings.useAmateurTags && isTag(settings.tags.amateur, tag)){
					tagHolder.addClass("s-amateur");
				}
				else if(settings.useLovemilfTags && isTag(settings.tags.lovemilf, tag)){
					tagHolder.addClass("s-lovemilf");
				}
				else if(settings.useMilfperfTags && isTag(settings.tags.milfperf, tag)){
					tagHolder.addClass("s-milfperf");
				}
				else if(settings.useLovesiteTags && isTag(settings.tags.lovesite, tag)){
					tagHolder.addClass("s-lovesite");
				}
				else if(settings.useLikesiteTags && isTag(settings.tags.likesite, tag)){
					tagHolder.addClass("s-likesite");
				}
				else if(settings.useHatedTags && isTag(settings.tags.hated, tag)){
					tagHolder.addClass("s-hated");
				}
				else if(settings.useUselessTags && isTag(settings.tags.useless, tag)){
					var uselessTag = tagHolder.addClass("s-useless");
					uselessTag.parent().detach().appendTo(".s-useless-tags").trigger("spyder.change");
				}
				else if(settings.useTerribleTags && isTag(settings.tags.terrible, tag)){
					tagHolder.addClass("s-terrible");
				}
				else if(settings.useDislikedTags && isTag(settings.tags.disliked, tag)){
					tagHolder.addClass("s-disliked");
				}

				var buttons = $j();

				if(settings.useGoodTags){
					if(!settings.buttonGoodTags){
						buttons = buttons.add($j("<div class='s-button s-add-good' title='Mark tag as LIKED'>+</div>").
										data("action", {fn : addTagElement, type : "good", tag : tag}));
					}
					buttons = buttons.add($j("<div class='s-button s-remove-good' title='Un-Mark tag as LIKED'>–</div>").
										data("action", {fn : removeTagElement, type : "good", tag : tag}));
				}
				if(settings.useLovedTags){
					buttons = buttons.add($j("<div class='s-button s-add-loved' title='Upgrade tag to LOVED'>+</div>").
										data("action", {fn : addLovedTagElement, type : "loved", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-loved' title='Downgrade tag from LOVED'>–</div>").
										data("action", {fn : removeLovedTagElement, type : "loved", tag : tag}));
				}
				if(settings.usePerformerTags){
					if(!settings.buttonPerformerTags){
						buttons = buttons.add($j("<div class='s-button s-add-performer' title='Mark tag as Performer'>+</div>").
										data("action", {fn : addTagElement, type : "performer", tag : tag}));
					}
					buttons = buttons.add($j("<div class='s-button s-remove-performer' title='Un-Mark tag as Performer'>–</div>").
										data("action", {fn : removeTagElement, type : "performer", tag : tag}));
				}
				if(settings.useLoveperfTags){
					buttons = buttons.add($j("<div class='s-button s-add-loveperf' title='Upgrade tag to Loved Performer'>+</div>").
										data("action", {fn : addLoveperfTagElement, type : "loveperf", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-loveperf' title='Downgrade tag from Loved Performer'>–</div>").
										data("action", {fn : removeLoveperfTagElement, type : "loveperf", tag : tag}));
				}
				if(settings.useNewperfTags){
					if(!settings.buttonNewperfTags){
						buttons = buttons.add($j("<div class='s-button s-add-newperf' title='Mark tag as New Performer'>+</div>").
										data("action", {fn : addTagElement, type : "newperf", tag : tag}));
					}
					buttons = buttons.add($j("<div class='s-button s-remove-newperf' title='Un-Mark tag as New Performer'>–</div>").
										data("action", {fn : removeTagElement, type : "newperf", tag : tag}));
				}
				if(settings.useAmateurTags){
					if(!settings.buttonAmateurTags){
						buttons = buttons.add($j("<div class='s-button s-add-amateur' title='Mark tag as Amateur'>+</div>").
										data("action", {fn : addTagElement, type : "amateur", tag : tag}));
					}
					buttons = buttons.add($j("<div class='s-button s-remove-amateur' title='Un-Mark tag as Amateur'>–</div>").
										data("action", {fn : removeTagElement, type : "amateur", tag : tag}));
				}
				if(settings.useLoveamatTags){
					buttons = buttons.add($j("<div class='s-button s-add-loveamat' title='Upgrade tag to Loved Amateur'>+</div>").
										data("action", {fn : addLoveamatTagElement, type : "loveamat", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-loveamat' title='Downgrade tag from Loved Amateur'>–</div>").
										data("action", {fn : removeLoveamatTagElement, type : "loveamat", tag : tag}));
				}
				if(settings.useMilfperfTags){
					if(!settings.buttonMilfperfTags){
					buttons = buttons.add($j("<div class='s-button s-add-milfperf' title='Mark tag as Milf Performer'>+</div>").
										data("action", {fn : addTagElement, type : "milfperf", tag : tag}));
					}
					buttons = buttons.add($j("<div class='s-button s-remove-milfperf' title='Un-Mark tag as Milf Performer'>–</div>").
										data("action", {fn : removeTagElement, type : "milfperf", tag : tag}));
				}
				if(settings.useLovemilfTags){
					buttons = buttons.add($j("<div class='s-button s-add-lovemilf' title='Upgrade tag to Loved Milf Performer'>+</div>").
										data("action", {fn : addlovemilfTagElement, type : "lovemilf", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-lovemilf' title='Downgrade tag from Loved Milf Performer'>–</div>").
										data("action", {fn : removelovemilfTagElement, type : "lovemilf", tag : tag}));
				}
				if(settings.useLikesiteTags){
					if(!settings.buttonLikesiteTags){
					buttons = buttons.add($j("<div class='s-button s-add-likesite' title='Mark tag as Liked Site'>+</div>").
										data("action", {fn : addTagElement, type : "likesite", tag : tag}));
					}
					buttons = buttons.add($j("<div class='s-button s-remove-likesite' title='Un-Mark tag as Liked Site'>–</div>").
										data("action", {fn : removeTagElement, type : "likesite", tag : tag}));
				}
				if(settings.useLovesiteTags){
					buttons = buttons.add($j("<div class='s-button s-add-lovesite' title='Upgrade tag to Loved Site'>+</div>").
										data("action", {fn : addLovesiteTagElement, type : "lovesite", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-lovesite' title='Downgrade tag from Loved Site'>–</div>").
										data("action", {fn : removeLovesiteTagElement, type : "lovesite", tag : tag}));
				}
				if(settings.useDislikedTags){
					if(!settings.buttonDislikedTags){
						buttons = buttons.add($j("<div class='s-button s-add-disliked' title='Mark tag as DISLIKED'>×</div>").
										data("action", {fn : addTagElement, type : "disliked", tag : tag}));
					}
					buttons = buttons.add($j("<div class='s-button s-remove-disliked' title='Un-Mark tag as DISLIKED'>–</div>").
										data("action", {fn : removeTagElement, type : "disliked", tag : tag}));
				}
				if(settings.useHatedTags){
					buttons = buttons.add($j("<div class='s-button s-add-hated' title='Mark tag as HATED'>×</div>").
										data("action", {fn : addHatedTagElement, type : "hated", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-hated' title='Un-Mark tag as HATED'>–</div>").
										data("action", {fn : removeHatedTagElement, type : "hated", tag : tag}));
				}
				if(settings.useTerribleTags){
					buttons = buttons.add($j("<div class='s-button s-add-terrible' title='Mark tag as BLACKLISTED. \nTorrents with this tag will be hidden!'>!</div>").
										data("action", {fn : addTerribleTagElement, type : "terrible", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-terrible' title='Un-Mark tag as BLACKLISTED'>–</div>").
										data("action", {fn : removeTerribleTagElement, type : "terrible", tag : tag}));
				}
				if(settings.useUselessTags){
					buttons = buttons.add($j("<div class='s-button s-add-useless' title='Mark tag as USELESS. \nThis tag will be hidden from all torrents!'>-</div>").
										data("action", {fn : addUselessTagElement, type : "useless", tag : tag}));
					buttons = buttons.add($j("<div class='s-button s-remove-useless' title='Un-Mark tag as USELESS'>–</div>").
										data("action", {fn : removeUselessTagElement, type : "useless", tag : tag}));
				}
				$j(buttons).addClass("s-button").prependTo(tagHolder);


				// create more horizontal space by hiding "tag action" placeholder spans
				tagHolder.next().find("span:contains('\xa0\xa0\xa0')").hide();
				// staff/mods have additional "tag actions", allow for additional styling
				if (tagHolder.next().find("a").length > 2){
					tagHolder.addClass("s-staff");
				}
			});

			$j(".s-button").on("click", function(e){
				var data = $j(this).data("action");
				data.fn(data.type, $j(this).parent(), data.tag);
			});
		};

		highlightDetailTags();

		$j(".s-useless-tags").trigger("spyder.change");
	}

	//Configuration
	function initConfig(base){
		//Init Display
		for(var name in settings){
			if(settings.hasOwnProperty(name)){
				if(name == "tags"){
					for(var tagType in settings[name]){
						if(settings[name].hasOwnProperty(tagType)){
							displayTags(tagType);
						}
					}
				}
				else{
					$j("input[name='"+name+"']").prop("checked", settings[name]);
				}
			}
		}

		//Init Listeners
		$j(".s-conf-tab").parent().on("click", function(){
			var tab = $j(this);
			if(!tab.hasClass("s-selected")){
				$j('.tab-row-container li').removeClass('s-selected');
				$j('.s-conf-page').removeClass("s-selected");
				tab.addClass("s-selected");
				$j(".s-conf-page#" + tab.data("page")).addClass("s-selected");
			}
		});

		$j(".s-conf-gen-checkbox").on("change", function(){
			var checkbox = $j(this);
			var name = checkbox.attr("name");
			var isChecked = checkbox.is(":checked");

			settings[name] = isChecked;
			if((name == "useTerribleTags" && isChecked) || (name == "useHatedTags" && isChecked) || (name == "useUselessTags" && isChecked)){
				$j("input[name='useDislikedTags']").prop("checked", true).trigger("change");
			}
			else if(name == "useDislikedTags" && !isChecked){
				$j("input[name='useTerribleTags']").prop("checked", false).trigger("change");
				$j("input[name='useHatedTags']").prop("checked", false).trigger("change");
				$j("input[name='useUselessTags']").prop("checked", false).trigger("change");
			}
			else if((name == "useLovesiteTags" && isChecked) ){
				$j("input[name='useLikesiteTags']").prop("checked", true).trigger("change");
			}
			else if(name == "useLikesiteTags" && !isChecked){
				$j("input[name='useLovesiteTags']").prop("checked", false).trigger("change");
			}
			else if((name == "useLovemilfTags" && isChecked) ){
				$j("input[name='useMilfperfTags']").prop("checked", true).trigger("change");
			}
			else if(name == "useMilfperfTags" && !isChecked){
				$j("input[name='useLovemilfTags']").prop("checked", false).trigger("change");
			}
			else if((name == "useLoveamatTags" && isChecked) ){
				$j("input[name='useAmateurTags']").prop("checked", true).trigger("change");
			}
			else if(name == "useAmateurTags" && !isChecked){
				$j("input[name='useLoveamatTags']").prop("checked", false).trigger("change");
			}
			else if((name == "useLoveperfTags" && isChecked) ){
				$j("input[name='usePerformerTags']").prop("checked", true).trigger("change");
			}
			else if(name == "usePerformerTags" && !isChecked){
				$j("input[name='useLoveperfTags']").prop("checked", false).trigger("change");
			}
			else if((name == "useLovedTags" && isChecked) ){
				$j("input[name='useGoodTags']").prop("checked", true).trigger("change");
			}
			else if(name == "useGoodTags" && !isChecked){
				$j("input[name='useLovedTags']").prop("checked", false).trigger("change");
			}


		});

		$j("#s-conf-save").on("click", function(e){
			e.preventDefault();
			saveSettings();
			displayStatus("success", "Settings updated successfully");
		});

		$j("#s-conf-close").on("click", function(){
			base.remove();
		});

		$j("#s-conf-status").on("click", "#s-conf-status-close", function(){
			$j(this).parent().fadeOut("fast");
		});

		$j(".s-conf-add-btn, .s-conf-remove-btn").on("click", function(){
			var button = $j(this);
			var method = button.hasClass("s-conf-remove-btn") ? removeTags : addTags;
			var type = button.data("type");
			var input = button.prev();
			var tags = $j.grep(input.val().toLowerCase().split(" "), function(tag){return tag;});
			if(tags.length){
				method(type, tags);
				input.val("");
				displayTags(type);
				displayStatus("success", type + " tags have been updated successfully.");
			}
			else{
				displayStatus("error", "Tags not updated becuase none were provided");
			}
		});

		function displayTags(type){
			$j("#s-conf-text-" + type).val(settings.tags[type].join(" "));
		}

		function displayStatus(type, msg){
			$j("#s-conf-status").fadeOut("fast", function(){
				$j(this).removeClass().addClass("s-" + type).html(msg + " <a id='s-conf-status-close'>(×)</a>").fadeIn("fast");
			});
		}

		function refreshUI() {
		  $j('#s-conf-background').remove();
		  initConfig($j(configHTML).prependTo("body"));
		}

	  // Import/export settings related code
	  function importSettings(rawSettings) {
		try {
		  const trimmedSettings = rawSettings.trim();
		  if (trimmedSettings.length === 0) {
			throw new Error('Settings empty.');
		  }
		  const importedSettings = JSON.parse(trimmedSettings);
		  // setValue("spyderSettings", trimmedSettings);
		  settings = importedSettings;
		  saveSettings();
		} catch (e) {
		  throw e;
		}
	  }

		$j('#import-settings-button').on('click', (e) => {
		  e.preventDefault();
		  try {
			const textArea = $j('#import-settings-textarea');

			importSettings(textArea.val());

			// Refresh UI with new settings.
			refreshUI();
			displayStatus("success", "Imported settings successfully.");
		  } catch (e) {
			displayStatus("error", `Unable to import settings: ${e.message}`)
		  }

		});

		// Populate export settings textarea with settings
		const ta = document.querySelector('#export-settings-textarea');
		ta.textContent = JSON.stringify(getSettings());

		// Escape closes ETH
		$j(document).keyup(function(e) {
			if (e.key === "Escape") {
			  base.remove();
		}
});
	}

	//General Purpose Funcitons
	function addTerribleTagElement(type, holder, tag){
		holder.removeClass("s-disliked");
		addTagElement(type, holder, tag);
	}
	function removeTerribleTagElement(type, holder, tag){
	   removeTagElement(type, holder, tag);
		holder.addClass("s-disliked");
	}
	function addHatedTagElement(type, holder, tag){
		holder.removeClass("s-disliked");
		addTagElement(type, holder, tag);
	}
	function removeHatedTagElement(type, holder, tag){
	   removeTagElement(type, holder, tag);
		holder.addClass("s-disliked");
	}
	function addLovedTagElement(type, holder, tag){
		holder.removeClass("s-good");
		addTagElement(type, holder, tag);
	}
	function removeLovedTagElement(type, holder, tag){
		removeTagElement(type, holder, tag);
		holder.addClass("s-good");
	}
	function addLoveperfTagElement(type, holder, tag){
		holder.removeClass("s-performer");
		addTagElement(type, holder, tag);
	}
	function removeLoveperfTagElement(type, holder, tag){
		removeTagElement(type, holder, tag);
		holder.addClass("s-performer");
	}
	function addLoveamatTagElement(type, holder, tag){
		holder.removeClass("s-amateur");
		addTagElement(type, holder, tag);
	}
	function removeLoveamatTagElement(type, holder, tag){
		removeTagElement(type, holder, tag);
		holder.addClass("s-amateur");
	}
	function addlovemilfTagElement(type, holder, tag){
		holder.removeClass("s-milfperf");
		addTagElement(type, holder, tag);
	}
	function removelovemilfTagElement(type, holder, tag){
		removeTagElement(type, holder, tag);
		holder.addClass("s-milfperf");
	}
	function addLovesiteTagElement(type, holder, tag){
		holder.removeClass("s-likesite");
		addTagElement(type, holder, tag);
	}
	function removeLovesiteTagElement(type, holder, tag){
		removeTagElement(type, holder, tag);
		holder.addClass("s-likesite");
	}
	function addUselessTagElement(type, holder, tag){
		holder.parent().detach().appendTo($j(".s-useless-tags"));
		$j(".s-useless-tags").trigger("spyder.change");
		addTagElement(type, holder, tag);
	}
	function removeUselessTagElement(type, holder, tag){
		holder.parent().detach().insertBefore($j(".s-useless-desc"));
		$j(".s-useless-tags").trigger("spyder.change");
		removeTagElement(type, holder, tag);
	}
	function addTagElement(type, holder, tag){
		holder.addClass("s-" + type);
		addTags(type, tag);
	}
	function removeTagElement(type, holder, tag){
		holder.removeClass("s-good s-loved s-performer s-loveperf s-newperf s-amateur s-loveamat s-milfperf s-lovemilf s-likesite s-lovesite s-disliked s-hated s-terrible s-useless");
		removeTags(type, tag);
	}
	function addTags(type, tags){
		settings = getSettings();
		var tagArray = settings.tags[type];
		var tmp = getEquivalentTags(tags);
		for(var i=0; i<tmp.length; i++){
			var tag = tmp[i];
			if(tag.length > 0){
				var idx = tagArray.indexOf(tag);
				if (idx < 0){
					tagArray.push(tag);
				}
			}
		}
		saveTags(type, tagArray);
	}
	function removeTags(type, tags){
		settings = getSettings();
		var tagArray = settings.tags[type];
		var tmp = getEquivalentTags(tags);
		for(var i=0; i<tmp.length; i++){
			var tag = tmp[i];
			if(tag.length > 0){
				var idx = tagArray.indexOf(tag);
				if (idx >= 0){
					tagArray.splice(idx, 1);
				}
			}
		}
		saveTags(type, tagArray);
	}
	function isTag(allTags, tag){
		if(allTags.indexOf(tag) >= 0){
			return true;
		}
		else if(allTags.indexOf(tag.replace(".", "")) >= 0){
			return true;
		}
		else{
			return false;
		}
	}
	function getValue(name, def){

		return GM_getValue(name, def);

	}
	function setValue(name, value){
		GM_setValue(name, value);
	}
	function saveTags(name, tagArray){
		var tmp = $j.grep(tagArray, function(tag){return tag;});
		tmp.sort();
		settings.tags[name] = tmp;
		saveSettings();
	}
	function getSettings(){
		return JSON.parse(getValue("spyderSettings", "{}"));
	}
	function saveSettings(){
		setValue("spyderSettings", JSON.stringify(settings));
	}
	function getEquivalentTags(tagArray){
		if(typeof tagArray == "string"){
			tagArray = tagArray.split(" ");
		}
		var allTags = [];
		for(var i = 0, length = tagArray.length; i < length; i++){
			var tag = tagArray[i];
			//if(/\./g.test(tag)){
			//	allTags.push(tag.replace(".", ""));
			//}
			allTags.push(tag);
		}
		return allTags;
	}
	function capitaliseFirstLetter(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}

if(typeof jQuery == "undefined"){
	addJQuery(runScript);
}
else{
	runScript();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "https://code.jquery.com/jquery-1.12.4.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}
