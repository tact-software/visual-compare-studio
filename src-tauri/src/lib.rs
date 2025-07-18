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
    let mime_type = get_mime_type(&path);
    
    Ok(format!("data:{};base64,{}", mime_type, base64_data))
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

fn get_mime_type(path: &str) -> &'static str {
    let extension = Path::new(path)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_lowercase();
    
    match extension.as_str() {
        "jpg" | "jpeg" => "image/jpeg",
        "png" => "image/png",
        "webp" => "image/webp",
        "avif" => "image/avif",
        "bmp" => "image/bmp",
        "gif" => "image/gif",
        _ => "application/octet-stream",
    }
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
            generate_thumbnail
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;
    use std::io::Write;

    #[test]
    fn test_get_mime_type() {
        assert_eq!(get_mime_type("test.jpg"), "image/jpeg");
        assert_eq!(get_mime_type("test.png"), "image/png");
        assert_eq!(get_mime_type("test.webp"), "image/webp");
        assert_eq!(get_mime_type("test.unknown"), "application/octet-stream");
    }

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
        assert!(base64_data.starts_with("data:"));
        assert!(base64_data.contains("base64,"));
    }

    #[test]
    fn test_read_image_file_nonexistent() {
        let result = read_image_file("nonexistent/file.jpg".to_string());
        assert!(result.is_err());
    }
}