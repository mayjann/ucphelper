function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes copySuccess { 0% { color: #fff; } 50% { color: #198754; transform: scale(1.1); } 100% { color: #fff; } }

        tr.ucp-clean-row td, tr.ucp-clean-row th {
            border: none !important;
            border-top: 1px solid #2d3035 !important;
            border-bottom: 1px solid #2d3035 !important;
            color: #c2c7d0 !important;
            vertical-align: middle !important;
        }
        tr.ucp-clean-row td:last-child, tr.ucp-clean-row th:last-child { border-right: none !important; }

        .ucp-row-banned { background-color: rgba(220, 53, 69, 0.08) !important; }
        .ucp-row-pk { background-color: rgba(253, 126, 20, 0.08) !important; }
        .ucp-row-batch { background-color: rgba(255, 193, 7, 0.05) !important; }

        tr.ucp-row-banned th:first-child { border-left: 3px solid #dc3545 !important; }
        tr.ucp-row-pk th:first-child { border-left: 3px solid #fd7e14 !important; }
        tr.ucp-row-batch th:first-child { border-left: 3px solid #ffc107 !important; }

        .ucp-table-badge {
            display: inline-flex; align-items: center; justify-content: center;
            height: 18px; padding: 0 6px; margin-left: 8px; border-radius: 3px;
            font-family: 'Roboto', sans-serif; font-size: 10px; font-weight: 700;
            text-transform: uppercase; color: #fff; cursor: help; white-space: nowrap;
            transform: translateY(-1px); box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .ucp-tb-accban { background-color: #212529; border: 1px solid #dc3545; color: #ff6b6b; }
        .ucp-tb-perm { background-color: #c0392b; border: 1px solid #a93226; }
        .ucp-tb-pk { background-color: #d35400; border: 1px solid #ba4a00; cursor: default; }
        .ucp-tb-temp { background-color: #5d6d7e; border: 1px solid #4b5866; }

        .ucp-name-flex { display: flex !important; align-items: center !important; flex-wrap: nowrap !important; }
        .ucp-name-flex a { color: #fff !important; font-weight: 600; margin-right: 5px; text-decoration: none; }

        .ucp-google-btn {
            display: inline-flex; align-items: center; justify-content: center;
            width: 18px; height: 18px; border-radius: 3px;
            background: #4285f4; color: #fff; font-weight: bold; font-size: 10px;
            text-decoration: none; margin-left: 5px; cursor: pointer;
            border: 1px solid #3367d6; opacity: 0.8; transition: 0.2s;
        }
        .ucp-google-btn:hover { opacity: 1; transform: scale(1.1); color: white; }

        .ucp-batch-tag {
            display: inline-block; vertical-align: middle;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 10px; font-weight: 700; color: #ffca2c;
            background: rgba(255, 202, 44, 0.12); padding: 3px 8px; border-radius: 4px;
            margin-left: 8px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1;
        }

        .ucp-nick-badge { 
            display: inline-flex; 
            align-items: center;
            justify-content: center;
            margin-left: 8px; 
            padding: 3px 8px; 
            border-radius: 4px; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 11px !important; 
            font-weight: 700 !important; 
            color: #fff !important; 
            vertical-align: middle; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            text-transform: uppercase;
            line-height: 1.2;
            letter-spacing: 0.3px;
        }
		
		.ucp-request-btn {
			display: inline-flex; 
			align-items: center; 
			justify-content: center;
			margin-left: 8px; 
			padding: 3px 8px; 
			border-radius: 4px; 
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
			font-size: 11px !important; 
			font-weight: 700 !important; 
			color: #fff !important; 
			vertical-align: middle; 
			box-shadow: 0 2px 4px rgba(0,0,0,0.2);
			text-transform: uppercase;
			line-height: 1.2;
			letter-spacing: 0.3px;
			
			background-color: #198754;
			border: 1px solid #146c43;
			cursor: pointer;
			transition: 0.2s ease;
			
			/* Добавляем минимальную ширину для всех кнопок */
			min-width: 60px;
		}

		.ucp-copy-popup {
			position: absolute;
			bottom: 120%;
			left: 50%;
			transform: translateX(-50%);
			background: #198754;
			color: #fff;
			padding: 4px 8px;
			border-radius: 4px;
			font-size: 10px;
			font-weight: 700;
			white-space: nowrap;
			z-index: 9999;
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.3s ease, transform 0.3s ease;
			
			/* Добавляем минимальную ширину для попапа */
			min-width: 70px;
			text-align: center;
		}

		.ucp-copy-popup.show {
			opacity: 1;
			transform: translateX(-50%) translateY(-4px);
		}

		.ucp-request-btn:hover {
			transform: scale(1.05);
			background-color: #157347;
			color: #fff;
		}

        .ucp-badge-red { background: #dc3545; border: 1px solid #b02a37; } 
        .ucp-badge-orange { background: #fd7e14; border: 1px solid #d3650d; }
        .ucp-badge-green { background: #2fad2a; border: 1px solid #2f7e20;} 
        .ucp-badge-purple { background: #6f42c1; border: 1px solid #59359a; } 
        .ucp-badge-brown { background: #795548; border: 1px solid #5e4238; } 
        .ucp-badge-blue { background: #0d6efd; border: 1px solid #0a58ca; }

        .ucp-skin-forbidden { box-shadow: 0 0 20px rgba(220, 53, 69, 0.6); border: 2px solid #dc3545; border-radius: 6px; filter: grayscale(80%); }
        .ucp-skin-allowed { box-shadow: 0 0 15px rgba(40, 167, 69, 0.4); border: 1px solid rgba(40, 167, 69, 0.4); border-radius: 6px; transition: all 0.3s ease; }
        .ucp-badge-error { background-color: #dc3545; color: white; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-top: 8px; text-align: center; width: fit-content; }
        .ucp-mono-font { font-family: 'Consolas', 'Courier New', monospace !important; font-size: 1.1em; letter-spacing: 0.5px; background: rgba(0,0,0,0.2); padding: 2px 5px; border-radius: 4px; }
        .ucp-alert-ban { background: linear-gradient(90deg, rgba(220, 53, 69, 0.10) 0%, rgba(220, 53, 69, 0.02) 100%); border-left: 4px solid #dc3545; color: #ff6b6b !important; padding: 10px 16px; border-radius: 2px; font-weight: 600; display: block; margin-top: 5px; animation: slideIn 0.4s ease-out; }

        .ucp-tooltip-box { position: absolute; background: #1a1c20; border: 1px solid #343a40; color: #e0e6f0; padding: 10px 14px; border-radius: 6px; font-size: 11px; z-index: 999999; box-shadow: 0 8px 20px rgba(0,0,0,0.6); pointer-events: none; min-width: 200px; animation: fadeIn 0.2s ease-out; }
        .ucp-tooltip-header { color: #fd7e14; font-weight: 800; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; display: block; text-transform: uppercase; }
        .ucp-tooltip-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .ucp-tooltip-label { color: #888; font-weight: 600; margin-right: 10px; }
        .ucp-tooltip-value { color: #fff; font-weight: 600; text-align: right; }
        .ucp-tooltip-reason { margin-top: 5px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.05); color: #adb5bd; font-style: italic; line-height: 1.3; }

        .ucp-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); z-index: 999999; display: flex; justify-content: center; align-items: center; animation: slideIn 0.3s ease; }
        .ucp-modal-content { background: #212529; box-shadow: 0 10px 50px rgba(0,0,0,0.5); padding: 30px; border-radius: 8px; text-align: center; max-width: 450px; color: #e0e6f0; position: relative; }
        .ucp-warning-icon { width: 60px; height: 60px; margin: 0 auto 20px auto; border: 3px solid #dc3545; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc3545; font-size: 30px; font-weight: bold; }
        .ucp-modal-btn { background: #dc3545; color: white; border: none; padding: 10px 30px; font-size: 14px; border-radius: 4px; cursor: pointer; transition: 0.2s; font-weight: 600; text-transform: uppercase; margin-top: 25px; }
        
        .ucp-update-icon { width: 60px; height: 60px; margin: 0 auto 15px auto; border: 3px solid #0d6efd; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0d6efd; font-size: 30px; font-weight: bold; }
        .ucp-update-btn { background: #0d6efd; color: #fff !important; border: none; padding: 10px 30px; font-size: 14px; border-radius: 4px; cursor: pointer; transition: 0.2s; font-weight: 600; text-transform: uppercase; margin-top: 25px; text-decoration: none; display: inline-block; }
        .ucp-update-btn:hover { background: #0b5ed7; color: #fff !important; transform: scale(1.05); }
        .ucp-changelog-box { text-align: left; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px; margin: 15px 0; max-height: 200px; overflow-y: auto; border: 1px solid #343a40; }
        .ucp-changelog-title { font-size: 12px; color: #6c757d; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
        .ucp-changelog-text { font-family: 'Consolas', monospace; font-size: 12px; color: #ced4da; white-space: pre-wrap; line-height: 1.4; }
        .ucp-close-sm { position: absolute; top: 10px; right: 15px; color: #6c757d; cursor: pointer; font-size: 20px; font-weight: bold; }
        .ucp-close-sm:hover { color: #fff; }

        .ucp-bad-word {
            background: rgba(220, 53, 69, 0.15);
            color: #ff6b6b;
            border-bottom: 1px dashed #dc3545;
            padding: 0 4px;
            border-radius: 3px;
            margin: 0 1px;
        }

        .ucp-mixed-char {
            background: rgba(111, 66, 193, 0.15);
            color: #a56eff;
            border-bottom: 1px dashed #6f42c1;
            padding: 0 2px;
            border-radius: 3px;
            font-weight: bold;
        }

        .ucp-clickable-nick { cursor: pointer; border-bottom: 1px dotted rgba(255,255,255,0.3); transition: 0.2s; }
        .ucp-clickable-nick:hover { color: #198754; border-bottom: 1px solid #198754; }

        .ucp-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
        }

        .ucp-modal-content {
            background: #22242b;
            color: #e0e6f0;
            padding: 20px;
            border-radius: 10px;
            min-width: 320px;
            max-width: 420px;
        }

        .ucp-modal-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .ucp-modal-text {
            font-size: 13px;
            line-height: 1.5;
        }

        .ucp-modal-btn {
            background: #2196f3;
            margin-top: 15px;
            padding: 6px 12px;
            cursor: pointer;
        }
        
        .ucp-modal-btn-ghost {
            background: transparent;
            border: 1px solid #2196f3;
            color: #2196f3;
            margin-top: 15px;
            padding: 6px 12px;
            cursor: pointer;
            border-radius: 4px;
            transition: 0.2s ease;
        }
        
        .ucp-history-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .ucp-history-table th,
        .ucp-history-table td {
            padding: 8px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .ucp-history-table thead th {
            font-weight: 600;
        }

        .ucp-history-row:hover {
            background: rgba(255,255,255,0.06);
        }
    `;
    document.head.appendChild(style);
}