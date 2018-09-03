import os
import json

DIRECTORY = './data'
OUTPUT = './output'
def process_playlist(playlist_filename):
    with open(os.path.join(DIRECTORY, playlist_filename)) as playlist_file:    
        raw_catalog = json.load(playlist_file)
    return raw_catalog

def youtube_link_dict(catalog):
    result = {}
    for song in catalog:
        result[song['link']] = song
    return result

def merge_catalogs(curr_catalog, main_catalog):
    curr_catalog_dict = youtube_link_dict(curr_catalog)
    main_catalog_dict = youtube_link_dict(main_catalog)
    curr_catalog_len = len(curr_catalog_dict)
    main_catalog_len = len(main_catalog_dict)
    print("Merging {} songs to current catalog of {} songs...".format(curr_catalog_len, main_catalog_len))
    merged_catalog_dict = {**curr_catalog_dict, **main_catalog_dict}
    merged_catalog_len = len(merged_catalog_dict)
    print("Skipping {} duplicates...".format((curr_catalog_len + main_catalog_len) - merged_catalog_len))
    print("Merge complete.")
    print("Main catalog now contains {} songs.".format(merged_catalog_len))
    merged_catalog = list(merged_catalog_dict.values())
    return merged_catalog

def main():
    final_catalog = {}
    print("Song Aggregator")
    print("===============")
    for filename in os.listdir(DIRECTORY):
        if filename.endswith(".json"): 
            print("Loading playlist...")
            print("PLAYLIST: \"{}\"".format(filename))
            playlist_catalog = process_playlist(filename)
            final_catalog = merge_catalogs(playlist_catalog, final_catalog)
        print("--")

    print(type(final_catalog))
    with open(os.path.join(OUTPUT, 'final_catalog.json'), 'w') as outfile:
        json.dump(final_catalog, outfile, indent=4)

    with open(os.path.join(OUTPUT, 'final_catalog.txt'), 'w') as outfile:
        for song in final_catalog:
            song_txt = "title: {} | artist: {} | time: {} | link: {}\n".format(
                song['title'],
                song['artist'],
                song['time'],
                song['link']
            )
            outfile.write(song_txt)


if __name__=="__main__":
    main()