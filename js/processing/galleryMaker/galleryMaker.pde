/*
listing-files taken from http://wiki.processing.org/index.php?title=Listing_files
@author antiplastik
*/
 
// we^ll have a look in the data folder
java.io.File folder = new java.io.File(dataPath("C:/Users/David/Documents/GitHub/images/portfolio"));
 
// let^s set a filter (which returns true if file^s extension is .jpg)
java.io.FilenameFilter jpgFilter = new java.io.FilenameFilter() {
  boolean accept(File dir, String name) {
    return name.toLowerCase().endsWith(".jpg");
  }
};
 
// list the files in the data folder, passing the filter as parameter
String[] filenames = folder.list(jpgFilter);
 
// get and display the number of jpg files
println(filenames.length + " jpg files in specified directory");
 
// display the filenames
for (int i = 0; i < filenames.length; i++) {
  println( "<a href=^../../images/portfolio/" + filenames[i] + "^ width=^400^ rel=^lightbox[portfolio]^>");
   println( "<img src=^../../images/portfolio/" + filenames[i] + "^  width=^400^ rel=^lightbox[portfolio]^/></a><br>");
}

