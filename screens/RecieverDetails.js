import { Icon, Header, Card } from 'react-native-elements';
import firebase from 'firebase';
import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import db from '../config';

export default class RecieverDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: firebase.auth().currentUser.email,
            recieverId: this.props.navigation.getParam['details']['user_id'],
            requestId: this.props.navigation.getParam['details']['request_id'],
            itemName: this.props.navigation.getParam['details']['item_name'],
            reason_for_requesting: this.props.navigation.getParam['details']['reason_to_request'],
            recieverName: '',
            recieverContact: '',
            recieverAddress: '',
            recieverRequestDocId: '',
            userName:""
        }
    }

    getRecieverDetails = () => {
        db.collection('users').where('email_id', '==', this.state.recieverId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        recieverName: doc.data().first_name,
                        recieverContact: doc.data().contact,
                        recieverAddress: doc.data().address
                    })
                })
            })
        db.collection('requested_items').where('request_id', '==', this.state.requestId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        recieverRequestDocId: doc.id
                    })
                })
            })
    }

    updateItemStatus=()=>{
        db.collection('all_donations').add({
            book_name:this.state.itemName,
            request_id:this.state.requestId,
            requested_by:this.state.recieverName,
            donor_id:this.state.userId,
            request_status:"Donor Intrested"
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.1 }}>
                    <Header
                        leftComponent={<Icon name='arrow-left' type='feather' color='#696969' onPress={() => this.props.navigation.goBack()} />}
                        centerComponent={{ text: "Donate Items", style: { color: '#90a5a9', fontSize: 20, fontWeight: "bold" } }}
                        backgroundColor='#eaf8fe'
                    />
                </View>
                <View style={{ flex: 0.3 }}>
                    <Card title={"Item Information"}
                    titleStyle={{fontSize:20}}>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Name:{this.state.itemName}</Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight:'bold'}}>Reason:{this.state.reason_for_requesting}</Text>
                        </Card>
                    </Card>
                </View>

                <View style={{ flex: 0.3 }}>
                    <Card title={"Reciever Information"}
                    titleStyle={{fontSize:20}}>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Name:{this.state.recieverName}</Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight:'bold'}}>Contact:{this.state.recieverContact}</Text>
                        </Card>

                        <Card>
                            <Text style={{fontWeight:'bold'}}>Address:{this.state.recieverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={styles.buttonContainer}>
                    {
                        this.state.recieverId !== this.state.userId
                        ? (
                            <TouchableOpacity style={styles.button}
                            onPress={()=>{
                                this.updateItemStatus()
                                this.props.navigation.navigate('MyDonations')
                            }}>
                                <Text>I want to Donate</Text>
                            </TouchableOpacity>
                        )
                        : null
                    } 
                </View>
            </View>
        )
    }
}