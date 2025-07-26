use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::time::SystemTime;
use base64::Engine;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileMetadata {
    path: String,
    name: String,
    size: u64,
    last_modified: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImageInfo {
    path: String,
    name: String,
    size: u64,
    last_modified: u64,
    width: u32,
    height: u32,
    format: String,
}

#[tauri::command]
fn get_image_info(path: String) -> Result<ImageInfo, String> {
    let path_buf = Path::new(&path);
    
    // Get file metadata
    let metadata = fs::metadata(&path_buf)
        .map_err(|e| format!("Failed to read file metadata: {}", e))?;
    
    let name = path_buf
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();
    
    let last_modified = metadata
        .modified()
        .unwrap_or(SystemTime::UNIX_EPOCH)
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    
    // For now, return placeholder image dimensions
    // In a real implementation, we would use an image processing library
    Ok(ImageInfo {
        path: path.clone(),
        name,
        size: metadata.len(),
        last_modified,
        width: 1920, // Placeholder
        height: 1080, // Placeholder
        format: "jpeg".to_string(), // Placeholder
    })
}

#[tauri::command]
fn read_image_file(path: String) -> Result<String, String> {
    let image_data = fs::read(&path)
        .map_err(|e| format!("Failed to read image file: {}", e))?;
    
    // Convert to base64 for transfer to frontend
    let base64_data = base64::engine::general_purpose::STANDARD.encode(&image_data);
    
    Ok(base64_data)
}

#[tauri::command]
fn get_file_metadata(path: String) -> Result<FileMetadata, String> {
    let path_buf = Path::new(&path);
    let metadata = fs::metadata(&path_buf)
        .map_err(|e| format!("Failed to read file metadata: {}", e))?;
    
    let name = path_buf
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();
    
    let last_modified = metadata
        .modified()
        .unwrap_or(SystemTime::UNIX_EPOCH)
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    
    Ok(FileMetadata {
        path,
        name,
        size: metadata.len(),
        last_modified,
    })
}

#[tauri::command]
fn generate_thumbnail(path: String, _max_size: u32) -> Result<String, String> {
    // Placeholder implementation
    // In a real implementation, we would use an image processing library
    // to generate actual thumbnails
    read_image_file(path)
}

fn is_image_file(path: &Path) -> bool {
    if let Some(extension) = path.extension().and_then(|e| e.to_str()) {
        matches!(extension.to_lowercase().as_str(), "jpg" | "jpeg" | "png" | "webp" | "avif" | "bmp" | "gif")
    } else {
        false
    }
}

#[tauri::command]
async fn scan_folder_for_images(folder_path: String) -> Result<Vec<String>, String> {
    use tokio::task;
    
    // Run the blocking file system operations in a separate thread
    let result = task::spawn_blocking(move || -> Result<Vec<String>, String> {
        let folder = Path::new(&folder_path);
        
        if !folder.exists() {
            return Err("Folder does not exist".to_string());
        }
        
        if !folder.is_dir() {
            return Err("Path is not a directory".to_string());
        }
        
        let mut image_paths = Vec::new();
        scan_directory_recursive(folder, &mut image_paths)?;
        
        // Sort paths for consistent ordering
        image_paths.sort();
        
        Ok(image_paths)
    }).await;
    
    match result {
        Ok(paths) => paths,
        Err(e) => Err(format!("Task failed: {}", e))
    }
}

fn scan_directory_recursive(dir: &Path, image_paths: &mut Vec<String>) -> Result<(), String> {
    let entries = fs::read_dir(dir)
        .map_err(|e| format!("Failed to read directory {}: {}", dir.display(), e))?;
    
    for entry in entries {
        let entry = entry
            .map_err(|e| format!("Failed to read directory entry: {}", e))?;
        
        let path = entry.path();
        
        if path.is_dir() {
            // Recursively scan subdirectories
            scan_directory_recursive(&path, image_paths)?;
        } else if path.is_file() && is_image_file(&path) {
            if let Some(path_str) = path.to_str() {
                image_paths.push(path_str.to_string());
            }
        }
    }
    
    Ok(())
}


use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::Emitter;

fn create_menu(app: &tauri::AppHandle) -> Result<Menu<tauri::Wry>, tauri::Error> {
    let menu = Menu::new(app)?;
    
    // File menu
    let file_menu = Submenu::new(
        app,
        "File",
        true
    )?;
    
    let open_files = MenuItem::with_id(app, "open-files", "Open Files...", true, Some("CmdOrCtrl+O"))?;
    let open_folder1 = MenuItem::with_id(app, "open-folder1", "Open Folder 1...", true, Some("CmdOrCtrl+Shift+1"))?;
    let open_folder2 = MenuItem::with_id(app, "open-folder2", "Open Folder 2...", true, Some("CmdOrCtrl+Shift+2"))?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, Some("CmdOrCtrl+Q"))?;
    
    file_menu.append(&open_files)?;
    file_menu.append(&PredefinedMenuItem::separator(app)?)?;
    file_menu.append(&open_folder1)?;
    file_menu.append(&open_folder2)?;
    file_menu.append(&PredefinedMenuItem::separator(app)?)?;
    file_menu.append(&quit)?;
    
    // Edit menu
    let edit_menu = Submenu::new(
        app,
        "Edit",
        true
    )?;
    
    edit_menu.append(&PredefinedMenuItem::undo(app, None)?)?;
    edit_menu.append(&PredefinedMenuItem::redo(app, None)?)?;
    edit_menu.append(&PredefinedMenuItem::separator(app)?)?;
    edit_menu.append(&PredefinedMenuItem::cut(app, None)?)?;
    edit_menu.append(&PredefinedMenuItem::copy(app, None)?)?;
    edit_menu.append(&PredefinedMenuItem::paste(app, None)?)?;
    edit_menu.append(&PredefinedMenuItem::select_all(app, None)?)?;
    
    // View menu
    let view_menu = Submenu::new(
        app,
        "View",
        true
    )?;
    
    let reset_zoom = MenuItem::with_id(app, "reset-zoom", "Reset Zoom", true, Some("CmdOrCtrl+0"))?;
    let zoom_in = MenuItem::with_id(app, "zoom-in", "Zoom In", true, Some("CmdOrCtrl+Plus"))?;
    let zoom_out = MenuItem::with_id(app, "zoom-out", "Zoom Out", true, Some("CmdOrCtrl+Minus"))?;
    
    view_menu.append(&reset_zoom)?;
    view_menu.append(&zoom_in)?;
    view_menu.append(&zoom_out)?;
    
    // Window menu
    let window_menu = Submenu::new(
        app,
        "Window",
        true
    )?;
    
    window_menu.append(&PredefinedMenuItem::minimize(app, None)?)?;
    window_menu.append(&PredefinedMenuItem::maximize(app, None)?)?;
    window_menu.append(&PredefinedMenuItem::close_window(app, None)?)?;
    
    // Help menu
    let help_menu = Submenu::new(
        app,
        "Help",
        true
    )?;
    
    let about = MenuItem::with_id(app, "about", "About Visual Compare Studio", true, None::<&str>)?;
    help_menu.append(&about)?;
    
    // Append all menus to the menu bar
    menu.append(&file_menu)?;
    menu.append(&edit_menu)?;
    menu.append(&view_menu)?;
    menu.append(&window_menu)?;
    menu.append(&help_menu)?;
    
    Ok(menu)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_image_info,
            read_image_file,
            get_file_metadata,
            generate_thumbnail,
            scan_folder_for_images
        ])
        .setup(|app| {
            let menu = create_menu(&app.handle())?;
            app.set_menu(menu)?;
            
            // Handle menu events
            app.on_menu_event(move |app, event| {
                match event.id.0.as_str() {
                    "quit" => {
                        app.exit(0);
                    }
                    "open-files" => {
                        // Emit event to frontend
                        let _ = app.emit("menu-action", "open-files");
                    }
                    "open-folder1" => {
                        let _ = app.emit("menu-action", "open-folder1");
                    }
                    "open-folder2" => {
                        let _ = app.emit("menu-action", "open-folder2");
                    }
                    "reset-zoom" => {
                        let _ = app.emit("menu-action", "reset-zoom");
                    }
                    "zoom-in" => {
                        let _ = app.emit("menu-action", "zoom-in");
                    }
                    "zoom-out" => {
                        let _ = app.emit("menu-action", "zoom-out");
                    }
                    "about" => {
                        let _ = app.emit("menu-action", "about");
                    }
                    _ => {}
                }
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;
    use std::io::Write;


    #[test]
    fn test_get_file_metadata() {
        // Create a temporary file
        let mut temp_file = NamedTempFile::new().unwrap();
        write!(temp_file, "test content").unwrap();
        
        let path = temp_file.path().to_string_lossy().to_string();
        let result = get_file_metadata(path.clone());
        
        assert!(result.is_ok());
        let metadata = result.unwrap();
        assert_eq!(metadata.path, path);
        assert!(metadata.name.len() > 0);
        assert!(metadata.size > 0);
        assert!(metadata.last_modified > 0);
    }

    #[test]
    fn test_get_file_metadata_nonexistent() {
        let result = get_file_metadata("nonexistent/file.txt".to_string());
        assert!(result.is_err());
    }

    #[test]
    fn test_get_image_info() {
        // Create a temporary file
        let mut temp_file = NamedTempFile::new().unwrap();
        write!(temp_file, "fake image data").unwrap();
        
        let path = temp_file.path().to_string_lossy().to_string();
        let result = get_image_info(path.clone());
        
        assert!(result.is_ok());
        let info = result.unwrap();
        assert_eq!(info.path, path);
        assert!(info.name.len() > 0);
        assert!(info.size > 0);
        assert_eq!(info.width, 1920); // Placeholder value
        assert_eq!(info.height, 1080); // Placeholder value
        assert_eq!(info.format, "jpeg"); // Placeholder value
    }

    #[test]
    fn test_read_image_file() {
        // Create a temporary file with some data
        let mut temp_file = NamedTempFile::new().unwrap();
        write!(temp_file, "test data").unwrap();
        
        let path = temp_file.path().to_string_lossy().to_string();
        let result = read_image_file(path);
        
        assert!(result.is_ok());
        let base64_data = result.unwrap();
        // Now returns only base64 data, not a data URL
        assert!(!base64_data.is_empty());
        assert!(base64_data.chars().all(|c| c.is_ascii_alphanumeric() || c == '+' || c == '/' || c == '='));
    }

    #[test]
    fn test_read_image_file_nonexistent() {
        let result = read_image_file("nonexistent/file.jpg".to_string());
        assert!(result.is_err());
    }
}