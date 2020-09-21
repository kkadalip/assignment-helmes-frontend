import React, {Suspense, useEffect, useState} from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import {ProgressSpinner} from 'primereact/progressspinner';
import {SelectButton} from 'primereact/selectbutton';
import {Button} from 'primereact/button';
import {useTranslation} from 'react-i18next';
import logo from './logo.svg';
import './main.css';
import axios from "axios/index";
import i18n from "./translations/i18n"; // <- DO NOT DELETE

axios.defaults.withCredentials = true;

function Page() {

	const apiRoot = 'http://localhost:8090/api/';
	const urlSectors = apiRoot + 'sectors';
	const urlSession = apiRoot + 'session';
	const langSelectItems = [
		{label: 'English', value: 'en'},
		{label: 'Eesti', value: 'et'}
	];

	const keySessionStorageSelectedLanguage = 'AssignmentSelectedLanguage';
	const keySessionStorageUsername = 'AssignmentUsername';
	const keySessionStorageSelectedSectors = 'AssignmentSelectedSectors';
	const keySessionStorageAgreedToTerms = 'AssignmentAgreedToTerms';

	let [username, setUsername] = useState("");
	let [isLoadingSectors, setIsLoadingSectors] = useState(true);
	let [sectors, setSectors] = useState([]);
	let [selectedSectors, setSelectedSectors] = useState([]);
	let [agreedToTerms, setAgreedToTerms] = useState(false);

	useEffect(() => {
		getSectors();

		getSession();

		const savedLanguage = sessionStorage.getItem(keySessionStorageSelectedLanguage) || 'en';
		changeLanguage(savedLanguage);

		const savedUsername = sessionStorage.getItem(keySessionStorageUsername) || "";
		changeUsername(savedUsername);

		const savedSelectedSectors = JSON.parse(sessionStorage.getItem(keySessionStorageSelectedSectors)) || [];
		changeSelectedSectors(savedSelectedSectors);

		const savedAgreedToTerms = JSON.parse(sessionStorage.getItem(keySessionStorageAgreedToTerms)) || false;
		changeAgreedToTerms(savedAgreedToTerms);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {t, i18n} = useTranslation();
	const changeLanguage = lng => {
		i18n.changeLanguage(lng).then(() => {
					sessionStorage.setItem(keySessionStorageSelectedLanguage, lng);
				}
		);
	};

	const changeUsername = name => {
		setUsername(name);
		sessionStorage.setItem(keySessionStorageUsername, name);
		//console.log("Changed username to: " + JSON.stringify(name));
	};

	const changeSelectedSectors = selectedOptions => {
		setSelectedSectors(selectedOptions);
		sessionStorage.setItem(keySessionStorageSelectedSectors, JSON.stringify(selectedOptions));
		//console.log("Changed selected sector ID-s to: " + JSON.stringify(selectedOptions));
	};

	const changeAgreedToTerms = checked => {
		setAgreedToTerms(checked);
		sessionStorage.setItem(keySessionStorageAgreedToTerms, JSON.stringify(checked));
		//console.log("Changed agreed terms to: " + checked);
	};

	const getSectors = () => {
		axios.get(urlSectors)
				.then(res => res.data)
				.then(data => {
							setIsLoadingSectors(false);
							setSectors(data);
							//console.log("Sectors data is: ", data);
						}
				)
				.catch(err => {
					console.error("Could not fetch Sectors data ", err);
				}, [])
	};

	const getSession = () => {
		axios.get(urlSession)
				.then(res => res.data)
				.then(data => {
							setUsername(data.username);
							setSelectedSectors(data.sectors);
							setAgreedToTerms(data.agreedToTerms);
							console.log("Session data is: ", data);
						}
				)
				.catch(err => {
					console.error("Could not fetch Sectors data ", err);
				}, [])
	};

	const handleChangeUsername = (event) => {
		let value = event.target.value;
		changeUsername(value);
	};

	const handleChangeSelect = (event) => {
		let selectedOptions = [...event.target.options].filter(o => o.selected).map(o => o.value);
		changeSelectedSectors(selectedOptions);
	};

	const handleChangeAgreedToTerms = (event) => {
		let checked = event.target.checked;
		changeAgreedToTerms(checked);
	};

	function createSectorsTable(items, currentlevel) {
		let level = 0;
		if (currentlevel !== undefined) {
			level = currentlevel;
		}
		return items.map(function (item) {
					let hasChildSectors = item.childSectors && item.childSectors.length > 0;
					let spacer = "\u00A0\u00A0\u00A0\u00A0".repeat(level);
					return <React.Fragment key={'fragment-' + item.id}>
						<option key={'option-' + item.id} value={item.id}>{spacer}{t(item.name)}</option>
						{hasChildSectors && createSectorsTable(item.childSectors, level + 1)}
					</React.Fragment>
				}
		);
	}

	const handleSubmit = event => {
		event.preventDefault()
		//console.log("Selected sectors are " + JSON.stringify(selectedSectors));
		axios.post(apiRoot + 'save', {
			username: username.trim(),
			sectors: selectedSectors,
			agreedToTerms: agreedToTerms
		})
				.then(function (response) {
					//console.log(response);
					alert(t('alert.data-saved'));
				})
				.catch(err => {
					console.error(err);
					alert(t('alert.failed'));
				});
	}

	return <div className="app">
		<div className="lang-title-and-main">
			<div className="select-language-button-wrapper">
				<SelectButton value={i18n.language} options={langSelectItems} onChange={(e) => changeLanguage(e.value)} className='select-language-button'/>
			</div>
			<div className="title-and-main">
				<header>
					<div className="unselectable title-big">
						<span>{t('title.main')}</span>
					</div>
				</header>
				<div hidden={!isLoadingSectors}>
					<ProgressSpinner/>
				</div>
				<div hidden={isLoadingSectors} className="main">
					<form onSubmit={handleSubmit}>
						<div className="main-content">
							<div className="data-block">
								<span className="unselectable">{t('content.please-enter-data')}</span>
							</div>
							<div className="data-block">
								<label>
									<span className="row-title unselectable">{t('content.name')}</span>
									<input type="text" value={username} onChange={handleChangeUsername} required/>
								</label>
							</div>
							<div className="data-block">
								<label>
									<span className="row-title unselectable align-top">{t('content.sectors')}</span>
									<select multiple value={selectedSectors} size="30" name="sectors" onChange={handleChangeSelect} required>
										<React.Fragment>{createSectorsTable(sectors)}</React.Fragment>
									</select>
								</label>
							</div>
							<div className="data-block">
								<label>
									<input type="checkbox" checked={agreedToTerms} className="row-title" onChange={handleChangeAgreedToTerms} required/>
									<span className="row-title unselectable">{t('content.agreed-to-terms')}</span>
								</label>
							</div>
							<div className="submit-block">
								<Button label={t('content.save')}/>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
}

const Loader = () => (
		<div className="app">
			<img src={logo} className="App-logo" alt="logo"/>
			<div>loading...</div>
		</div>
);

export default function App() {
	return (
			<Suspense fallback={<Loader/>}>
				<Page/>
			</Suspense>
	);
}