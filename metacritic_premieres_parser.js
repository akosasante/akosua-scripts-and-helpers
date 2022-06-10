(function() {
    function MetacriticParser() {

        const EXCLUDED_GENRES = [
            "Foreign",
            "Children",
            "Family",
            "Reality",
            "Special",
            "Talk",
            "Sports",
            "Documentary",
            "Music",
            "Live event",
            "Anime"
        ]

        // grab all image tags with the attribute alt="NEW"
        // make an array
        // drop the first one since it's the one in the description at the top of the page
        imageTags = Array.from(document.querySelectorAll("img[alt='NEW']")).splice(1);

        // map through imageTags and return a list of objects that include title, trailer, and channel
        // this list of objects can be pasted into a script to add them to our sheet
        // https://script.google.com/home/projects/1kYR6M6thwVuW8AeOPZY_b4_m7qarIrd9NfzQz25bzZr5eqTj-8DLvKN6/edit
        return imageTags.map(imageTag => {
            const tableRow = getTableRowFromImage(imageTag);
            const title = getShowTitleFromRow(tableRow);
            const trailer = getTrailerFromRow(tableRow);
            const genre = getGenreFromRow(tableRow);
            const channel = getChannelFromRow(tableRow);
            return { title, trailer, channel, genre };
        }).filter(showObj => {
            const included = isIncludedGenre(showObj.genre);
            if (included) {
                return true;
            } else {
                console.log(`excluding ${showObj.title} because genre is ${showObj.genre}`);
                return false;
            }
        });

        function getTableRowFromImage(imageTag) {
            return imageTag.parentElement.parentElement;
        }

        function getShowTitleFromRow(tableRow) {
            titleCell = tableRow.getElementsByClassName("title");
            return titleCell && titleCell[0] ? titleCell[0].innerText.trim() : "";
        }

        function getTrailerFromRow(tableRow) {
            titleCell = tableRow.getElementsByClassName("title") || [];
            trailerLinkCell = titleCell[0] ? titleCell[0].getElementsByTagName("a") : [];
            return trailerLinkCell[0] ? trailerLinkCell[0].getAttribute("href") : ""
        }

        function getGenreFromRow(tableRow) {
            genreCell = tableRow.children[2];
            return genreCell ? genreCell.innerText.trim() : "";
        }

        function getChannelFromRow(tableRow) {
            channelCell = tableRow.children[3];
            if (channelCell && channelCell.children.length && channelCell.children[0].tagName === "IMG") {
                channelImage = channelCell.getElementsByTagName("img")[0]
                return channelImage ? channelImage.getAttribute("alt").trim() : "";
            } else if (channelCell && channelCell.tagName === "TD") {
                return channelCell.innerText.trim() || "";
            } else {
                return "";
            }
        }

        function isIncludedGenre(genre) {
            return !EXCLUDED_GENRES.some(excluded_genre => genre.includes(excluded_genre))
        }
    }


    console.log(MetacriticParser());
    console.log(JSON.stringify(MetacriticParser()));
    return JSON.stringify(MetacriticParser());
})();
