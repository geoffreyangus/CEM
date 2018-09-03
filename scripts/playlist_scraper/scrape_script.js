clean_time = (raw_time) => {
    time = raw_time.replace(/\n/g, '')
    time = time.replace(/\s/g, '')
    return time
}

clean_title = (raw_title) => {
    title = raw_title.replace(/\(.*?\)\s?/g, '')
    title = title.replace(/\[.*?\]\s?/g, '')
    title = title.trim()
    return title
}

find_dash = (youtube_title) => {
    dash_idx = youtube_title.indexOf(' - ')
    if (dash_idx == -1) {
        dash_idx = youtube_title.indexOf(' – ')
    }
    return dash_idx
}

get_elements = (table_row, has_new_table) => {
    if (has_new_table) {
        return {
            'link': table_row.querySelector('#content a').getAttribute('href'),
            'youtube_title': table_row.querySelector('#content #video-title').innerText,
            'raw_time': table_row.querySelector('#content ytd-thumbnail-overlay-time-status-renderer span').innerText
        }        
    } else {
        raw_time_element = table_row.querySelector('.pl-video-time .timestamp span')
        if (!raw_time_element) {
            raw_time = null
        }
        else {
            raw_time = raw_time_element.innerText
        }
        return {
            'link': table_row.querySelector('.pl-video-title a').getAttribute('href'),
            'youtube_title': table_row.getAttribute('data-title'),
            'raw_time': raw_time
        }
    }
}

new_table = document.body.querySelector('ytd-playlist-video-list-renderer')
if (new_table) {
    data = new_table.querySelectorAll('ytd-playlist-video-renderer')
}
else {
    old_table = document.body.querySelector('#pl-video-table')
    data = old_table.querySelectorAll('tr')
}

song_json = []
for (var i = 0; i < data.length; i++) {
    elements = get_elements(data[i], !!new_table)
    if (!elements['raw_time']) {
        console.log(i + ' SKIPPED: ' + elements['youtube_title'])
        continue
    }
    raw_link = 'www.youtube.com' + elements['link']
    end_link_idx = raw_link.indexOf('&')
    link = raw_link.substring(0, end_link_idx)
    youtube_title = elements['youtube_title']
    dash_idx = find_dash(youtube_title)
    if (dash_idx == -1) {
        console.log(i + ' SKIPPED: ' + youtube_title)
        continue
    }
    raw_title = youtube_title.substring(dash_idx + 2)
    artist = youtube_title.substring(0, dash_idx)
    title = clean_title(raw_title)
    // channel = data[i].querySelector('#content #metadata yt-formatted-string').getAttribute('title')
    raw_time = elements['raw_time']
    time = clean_time(raw_time)
    song_json.push({
        title,
        artist,
        // channel,
        time,
        link,
    })
}
copy(song_json)
song_json.length